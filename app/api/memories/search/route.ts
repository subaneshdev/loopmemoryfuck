import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { vectorStore } from '@/lib/pinecone';
import { generateEmbedding } from '@/lib/gemini';
import { getServerSession } from '@/lib/supabase-server';
import type { SearchMemoriesRequest, SearchMemoriesResponse } from '@/types';

// POST /api/memories/search - Semantic search
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

        const body: SearchMemoriesRequest = await request.json();
        const { query, projectId, limit = 10, minScore = 0.7 } = body;

        // Validation
        if (!query || typeof query !== 'string' || query.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: 'Query is required' },
                { status: 400 }
            );
        }

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
                    const memoryId = match.metadata?.memoryId as string;
                    const memory = await db.memories.findById(memoryId);

                    // Fetch Graph Context
                    const relations = await db.graph.getMemoryRelations(memoryId);

                    const graphContext = relations?.map((r: any) => ({
                        name: r.node.name,
                        type: r.node.type,
                        relation: r.relation_type
                    })) || [];

                    results.push({
                        memory: {
                            ...memory,
                            graph_context: graphContext // Attach to response
                        },
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
