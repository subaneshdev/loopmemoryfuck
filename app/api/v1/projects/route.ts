import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { authenticateApiKey, logApiUsage } from '@/lib/api-auth';

/**
 * Public API v1 — Projects
 * Authentication: X-API-Key header
 */

// GET /api/v1/projects — List projects
export async function GET(request: NextRequest) {
    const start = Date.now();
    const auth = await authenticateApiKey(request);

    if (!auth.success) {
        return NextResponse.json(
            { success: false, error: auth.error },
            { status: auth.statusCode || 401, headers: auth.rateLimitHeaders }
        );
    }

    try {
        const projects = await db.projects.findByUserId(auth.userId!);

        logApiUsage({
            apiKeyId: auth.keyId!,
            userId: auth.userId!,
            endpoint: '/api/v1/projects',
            method: 'GET',
            statusCode: 200,
            responseTimeMs: Date.now() - start,
        });

        return NextResponse.json(
            { success: true, projects },
            { headers: auth.rateLimitHeaders }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to list projects' },
            { status: 500, headers: auth.rateLimitHeaders }
        );
    }
}

// POST /api/v1/projects — Create a project
export async function POST(request: NextRequest) {
    const start = Date.now();
    const auth = await authenticateApiKey(request);

    if (!auth.success) {
        return NextResponse.json(
            { success: false, error: auth.error },
            { status: auth.statusCode || 401, headers: auth.rateLimitHeaders }
        );
    }

    try {
        const body = await request.json();
        const { name, description } = body;

        if (!name || typeof name !== 'string') {
            return NextResponse.json(
                { success: false, error: 'name is required' },
                { status: 400, headers: auth.rateLimitHeaders }
            );
        }

        const project = await db.projects.create({
            user_id: auth.userId!,
            name,
            description,
        });

        logApiUsage({
            apiKeyId: auth.keyId!,
            userId: auth.userId!,
            endpoint: '/api/v1/projects',
            method: 'POST',
            statusCode: 201,
            responseTimeMs: Date.now() - start,
        });

        return NextResponse.json(
            { success: true, project },
            { status: 201, headers: auth.rateLimitHeaders }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to create project' },
            { status: 500, headers: auth.rateLimitHeaders }
        );
    }
}

// CORS
export async function OPTIONS() {
    return new Response(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
        },
    });
}
