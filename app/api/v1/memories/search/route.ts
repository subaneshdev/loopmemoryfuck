import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { vectorStore } from '@/lib/pinecone';
import { generateEmbedding } from '@/lib/gemini';
import { authenticateApiKey, logApiUsage } from '@/lib/api-auth';

/**
 * Public API v1 — Semantic Memory Search
 * Authentication: X-API-Key header
 */

// POST /api/v1/memories/search
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
        const { query, projectId, limit = 10, minScore = 0.5 } = body;

        if (!query || typeof query !== 'string' || query.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: 'query is required' },
                { status: 400, headers: auth.rateLimitHeaders }
            );
        }

        // Generate query embedding
        const queryEmbedding = await generateEmbedding(query);

        // Search Pinecone
        const matches = await vectorStore.query(
            queryEmbedding,
            { userId: auth.userId!, projectId },
            limit
        );

        // Filter and enrich
        const validMatches = matches.filter(m => m.score && m.score >= minScore);

        const results = await Promise.all(validMatches.map(async (match) => {
            try {
                const memoryId = match.metadata?.memoryId as string;
                if (!memoryId) return null;

                const [memory, relations] = await Promise.all([
                    db.memories.findById(memoryId),
                    db.graph.getMemoryRelations(memoryId),
                ]);

                const graphContext = relations?.map((r: any) => ({
                    name: r.node.name,
                    type: r.node.type,
                    relation: r.relation_type,
                })) || [];

                return {
                    memory: {
                        id: memory.id,
                        content: memory.content,
                        source: memory.source,
                        project_id: memory.project_id,
                        created_at: memory.created_at,
                        graph_context: graphContext,
                    },
                    score: match.score || 0,
                };
            } catch {
                return null;
            }
        }));

        const finalResults = results
            .filter(r => r !== null)
            .sort((a, b) => (b?.score || 0) - (a?.score || 0));

        logApiUsage({
            apiKeyId: auth.keyId!,
            userId: auth.userId!,
            endpoint: '/api/v1/memories/search',
            method: 'POST',
            statusCode: 200,
            responseTimeMs: Date.now() - start,
        });

        return NextResponse.json(
            { success: true, results: finalResults, count: finalResults.length },
            { headers: auth.rateLimitHeaders }
        );
    } catch (error: any) {
        logApiUsage({
            apiKeyId: auth.keyId!,
            userId: auth.userId!,
            endpoint: '/api/v1/memories/search',
            method: 'POST',
            statusCode: 500,
            responseTimeMs: Date.now() - start,
        });

        return NextResponse.json(
            { success: false, error: error.message || 'Search failed' },
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
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
        },
    });
}
