import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { vectorStore } from '@/lib/pinecone';
import { generateEmbedding } from '@/lib/gemini';
import { getServerSession } from '@/lib/supabase-server';
import type { SearchMemoriesRequest, SearchMemoriesResponse } from '@/types';

// POST /api/memories/search - Semantic search
export async function POST(request: NextRequest) {
    const start = Date.now();
    console.log('[Search] Starting search request');
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
        const { query, projectId, limit = 10, minScore = 0.5 } = body; // Lowered minScore default

        // Validation
        if (!query || typeof query !== 'string' || query.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: 'Query is required' },
                { status: 400 }
            );
        }

        // Generate query embedding
        const embedStart = Date.now();
        const queryEmbedding = await generateEmbedding(query);
        console.log(`[Search] Embedding generation took ${Date.now() - embedStart}ms`);

        // Search Pinecone
        const pineconeStart = Date.now();
        const matches = await vectorStore.query(
            queryEmbedding,
            { userId, projectId },
            limit
        );
        console.log(`[Search] Pinecone query took ${Date.now() - pineconeStart}ms. Matches: ${matches.length}`);

        // Filter by score and fetch full memory details from Supabase
        // Filter by score and fetch full memory details from Supabase in parallel
        const validMatches = matches.filter(match => match.score && match.score >= minScore);
        console.log(`[Search] Valid matches (>=${minScore}): ${validMatches.length}`);

        const dbStart = Date.now();
        const results = await Promise.all(validMatches.map(async (match) => {
            try {
                const memoryId = match.metadata?.memoryId as string;

                // Run DB queries in parallel
                const [memory, relations] = await Promise.all([
                    db.memories.findById(memoryId),
                    db.graph.getMemoryRelations(memoryId)
                ]);

                const graphContext = relations?.map((r: any) => ({
                    name: r.node.name,
                    type: r.node.type,
                    relation: r.relation_type
                })) || [];

                return {
                    memory: {
                        ...memory,
                        graph_context: graphContext
                    },
                    score: match.score || 0,
                };
            } catch (error) {
                console.warn(`Memory not found or error fetching details for vector ${match.id}`, error);
                return null;
            }
        }));
        console.log(`[Search] DB enrichment took ${Date.now() - dbStart}ms`);

        // Filter out any failed results (nulls)
        const finalResults = results.filter(r => r !== null);

        // Sort by score descending
        finalResults.sort((a, b) => (b?.score || 0) - (a?.score || 0));

        console.log(`[Search] Total request duration: ${Date.now() - start}ms`);

        const response: SearchMemoriesResponse = {
            success: true,
            results: finalResults as any[],
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
