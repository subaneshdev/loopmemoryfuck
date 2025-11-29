import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { vectorStore } from '@/lib/pinecone';
import { generateEmbedding } from '@/lib/gemini';

// GET /api/memories/[id] - Get a single memory
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const memory = await db.memories.findById(id);

        return NextResponse.json({
            success: true,
            memory,
        });
    } catch (error: any) {
        console.error('Get memory error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Memory not found',
            },
            { status: 404 }
        );
    }
}

// PUT /api/memories/[id] - Update a memory
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const updates = await request.json();
        const { content, source, metadata } = updates;

        // Get existing memory
        const existingMemory = await db.memories.findById(id);

        // If content changed, re-generate embedding
        let vectorId = existingMemory.vector_id;
        if (content && content !== existingMemory.content) {
            const embedding = await generateEmbedding(content);

            // Delete old vector if it exists
            if (existingMemory.vector_id) {
                await vectorStore.delete(existingMemory.vector_id);
            }

            // Create new vector
            await vectorStore.upsert(vectorId!, embedding, {
                userId: existingMemory.user_id,
                projectId: existingMemory.project_id || '',
                memoryId: existingMemory.id,
                text: content.substring(0, 500),
            });
        }

        // Update memory in Supabase
        const memory = await db.memories.update(id, {
            content: content || existingMemory.content,
            source: source !== undefined ? source : existingMemory.source,
            metadata: metadata || existingMemory.metadata,
            vector_id: vectorId,
        });

        return NextResponse.json({
            success: true,
            memory,
        });
    } catch (error: any) {
        console.error('Update memory error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to update memory',
            },
            { status: 500 }
        );
    }
}

// DELETE /api/memories/[id] - Delete a memory
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Get memory to find vector_id
        const memory = await db.memories.findById(id);

        // Delete vector from Pinecone
        if (memory.vector_id) {
            await vectorStore.delete(memory.vector_id);
        }

        // Delete memory from Supabase
        await db.memories.delete(id);

        return NextResponse.json({
            success: true,
            message: 'Memory deleted successfully',
        });
    } catch (error: any) {
        console.error('Delete memory error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to delete memory',
            },
            { status: 500 }
        );
    }
}
