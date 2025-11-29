import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { vectorStore } from '@/lib/pinecone';
import { generateEmbedding } from '@/lib/gemini';
import type { SearchMemoriesRequest, SearchMemoriesResponse } from '@/types';

// POST /api/memories/search - Semantic search
export async function POST(request: NextRequest) {
    try {
        const body: SearchMemoriesRequest = await request.json();
        const { query, projectId, limit = 10, minScore = 0.7 } = body;

        // Validation
        if (!query || typeof query !== 'string' || query.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: 'Query is required' },
                { status: 400 }
            );
        }

        // For now, use a default user ID (in production, get from auth session)
        const userId = '00000000-0000-0000-0000-000000000000';

        // Generate query embedding
        const queryEmbedding = await generateEmbedding(query);

        // Search Pinecone
        const matches = await vectorStore.query(
            queryEmbedding,
            { userId, projectId },
            limit
        );

        // Filter by score and fetch full memory details from Supabase
        const results = [];
        for (const match of matches) {
            if (match.score && match.score >= minScore) {
                try {
                    const memory = await db.memories.findById(match.metadata?.memoryId as string);
                    results.push({
                        memory,
                        score: match.score,
                    });
                } catch (error) {
                    console.warn(`Memory not found for vector ${match.id}`);
                }
            }
        }

        // Sort by score descending
        results.sort((a, b) => b.score - a.score);

        const response: SearchMemoriesResponse = {
            success: true,
            results,
        };

        return NextResponse.json(response);
    } catch (error: any) {
        console.error('Search memories error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Failed to search memories',
            },
            { status: 500 }
        );
    }
}
