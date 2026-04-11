import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { vectorStore } from '@/lib/pinecone';
import { generateEmbedding } from '@/lib/gemini';
import { generateId } from '@/lib/utils';
import { authenticateApiKey, logApiUsage } from '@/lib/api-auth';

/**
 * Public API v1 — Memories
 * Authentication: X-API-Key header
 */

// POST /api/v1/memories — Create a memory
export async function POST(request: NextRequest) {
    const start = Date.now();
    const auth = await authenticateApiKey(request);

    if (!auth.success) {
        return NextResponse.json(
            { success: false, error: auth.error },
            {
                status: auth.statusCode || 401,
                headers: auth.rateLimitHeaders,
            }
        );
    }

    try {
        const body = await request.json();
        const { text, source, projectId, tags, metadata } = body;

        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: 'text is required' },
                { status: 400, headers: auth.rateLimitHeaders }
            );
        }

        // Generate embedding
        const embedding = await generateEmbedding(text);
        const vectorId = generateId();

        // Store in Supabase
        const memory = await db.memories.create({
            user_id: auth.userId!,
            project_id: projectId,
            content: text,
            source,
            metadata: { ...metadata, tags: tags || [] },
            vector_id: vectorId,
        });

        // Store vector in Pinecone (namespaced by userId)
        await vectorStore.upsert(vectorId, embedding, {
            userId: auth.userId!,
            projectId: projectId || '',
            memoryId: memory.id,
            text: text.substring(0, 500),
        });

        // Log usage (fire and forget)
        logApiUsage({
            apiKeyId: auth.keyId!,
            userId: auth.userId!,
            endpoint: '/api/v1/memories',
            method: 'POST',
            statusCode: 201,
            responseTimeMs: Date.now() - start,
        });

        return NextResponse.json(
            {
                success: true,
                memory: {
                    id: memory.id,
                    content: memory.content,
                    source: memory.source,
                    project_id: memory.project_id,
                    created_at: memory.created_at,
                },
            },
            { status: 201, headers: auth.rateLimitHeaders }
        );
    } catch (error: any) {
        logApiUsage({
            apiKeyId: auth.keyId!,
            userId: auth.userId!,
            endpoint: '/api/v1/memories',
            method: 'POST',
            statusCode: 500,
            responseTimeMs: Date.now() - start,
        });

        return NextResponse.json(
            { success: false, error: error.message || 'Failed to create memory' },
            { status: 500, headers: auth.rateLimitHeaders }
        );
    }
}

// GET /api/v1/memories — List memories
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
        const searchParams = request.nextUrl.searchParams;
        const projectId = searchParams.get('projectId') || undefined;
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        const memories = await db.memories.findByUserId(auth.userId!, projectId, limit, offset);

        logApiUsage({
            apiKeyId: auth.keyId!,
            userId: auth.userId!,
            endpoint: '/api/v1/memories',
            method: 'GET',
            statusCode: 200,
            responseTimeMs: Date.now() - start,
        });

        return NextResponse.json(
            { success: true, memories, count: memories.length },
            { headers: auth.rateLimitHeaders }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to list memories' },
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
