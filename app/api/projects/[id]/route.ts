import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';

// GET /api/projects/[id] - Get project details
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const project = await db.projects.findById(id);

        return NextResponse.json({
            success: true,
            project,
        });
    } catch (error: any) {
        console.error('Get project error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Project not found',
            },
            { status: 404 }
        );
    }
}

// PUT /api/projects/[id] - Update project
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const updates = await request.json();
        const { name, description } = updates;

        const project = await db.projects.update(id, {
            name,
            description,
        });

        return NextResponse.json({
            success: true,
            project,
        });
    } catch (error: any) {
        console.error('Update project error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to update project',
            },
            { status: 500 }
        );
    }
}

// DELETE /api/projects/[id] - Delete project
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await db.projects.delete(id);

        return NextResponse.json({
            success: true,
            message: 'Project deleted successfully',
        });
    } catch (error: any) {
        console.error('Delete project error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to delete project',
            },
            { status: 500 }
        );
    }
}
