import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { vectorStore } from '@/lib/pinecone';
import { generateEmbedding } from '@/lib/gemini';
import { generateId } from '@/lib/utils';
import type { CreateMemoryRequest, CreateMemoryResponse } from '@/types';

// POST /api/memories - Create a new memory
export async function POST(request: NextRequest) {
    try {
        const body: CreateMemoryRequest = await request.json();
        const { text, source, projectId, tags, metadata } = body;

        // Validation
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: 'Text is required' },
                { status: 400 }
            );
        }

        // For now, use a default user ID (in production, get from auth session)
        const userId = '00000000-0000-0000-0000-000000000000';

        // Generate embedding
        const embedding = await generateEmbedding(text);

        // Generate unique vector ID
        const vectorId = generateId();

        // Store vector in Pinecone
        await vectorStore.upsert(vectorId, embedding, {
            userId,
            projectId: projectId || '',
            memoryId: vectorId,
            text: text.substring(0, 500), // Store preview in metadata
        });

        // Store memory metadata in Supabase
        const memory = await db.memories.create({
            user_id: userId,
            project_id: projectId,
            content: text,
            source,
            metadata: {
                ...metadata,
                tags: tags || [],
            },
            vector_id: vectorId,
        });

        const response: CreateMemoryResponse = {
            success: true,
            memory,
        };

        return NextResponse.json(response, { status: 201 });
    } catch (error: any) {
        console.error('Create memory error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to create memory',
            },
            { status: 500 }
        );
    }
}

// GET /api/memories - List memories
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const projectId = searchParams.get('projectId') || undefined;
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        // For now, use a default user ID (in production, get from auth session)
        const userId = 'default-user';

        const memories = await db.memories.findByUserId(userId, projectId, limit, offset);

        return NextResponse.json({
            success: true,
            memories,
            count: memories.length,
        });
    } catch (error: any) {
        console.error('List memories error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to list memories',
            },
            { status: 500 }
        );
    }
}
