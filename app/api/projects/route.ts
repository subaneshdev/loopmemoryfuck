import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { getServerSession } from '@/lib/supabase-auth';
import type { CreateProjectRequest, CreateProjectResponse } from '@/types';

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
    try {
        // Get authenticated user
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        const body: CreateProjectRequest = await request.json();
        const { name, description } = body;

        // Validation
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: 'Name is required' },
                { status: 400 }
            );
        }

        const project = await db.projects.create({
            user_id: userId,
            name,
            description,
        });

        const response: CreateProjectResponse = {
            success: true,
            project,
        };

        return NextResponse.json(response, { status: 201 });
    } catch (error: any) {
        console.error('Create project error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to create project',
            },
            { status: 500 }
        );
    }
}

// GET /api/projects - List all projects
export async function GET(request: NextRequest) {
    try {
        // Get authenticated user
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const userId = session.user.id;

        const projects = await db.projects.findByUserId(userId);

        return NextResponse.json({
            success: true,
            projects,
            count: projects.length,
        });
    } catch (error: any) {
        console.error('List projects error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to list projects',
            },
            { status: 500 }
        );
    }
}
