import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { getServerSession } from '@/lib/supabase-server';
import { extractEntities } from '@/lib/gemini';

export const dynamic = 'force-dynamic';

// GET /api/debug/backfill-graph
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const userId = session.user.id;
        const limit = 20; // Process last 20 memories to avoid timeouts/rate-limits

        // 1. Fetch recent memories
        const memories = await db.memories.findByUserId(userId, undefined, limit);

        const results = {
            processed: 0,
            errors: 0,
            details: [] as string[]
        };

        // 2. Process each memory
        for (const memory of memories) {
            try {
                // Skip if already has relations? (hard to check efficiently without join, so just process)
                // We'll rely on UPSERT to handle duplicates.

                const { entities, relations } = await extractEntities(memory.content);

                if (entities.length === 0) continue;

                const nodeMap = new Map<string, string>(); // Name -> NodeID

                // Upsert Nodes
                for (const entity of entities) {
                    const node = await db.graph.upsertNode({
                        name: entity.name,
                        type: entity.type
                    });
                    if (node) {
                        nodeMap.set(entity.name, node.id);

                        // Link Memory
                        await db.graph.linkMemoryToNode({
                            memory_id: memory.id,
                            node_id: node.id,
                            relation_type: 'MENTIONS'
                        });
                    }
                }

                // Upsert Relations
                for (const rel of relations) {
                    const sourceId = nodeMap.get(rel.source);
                    const targetId = nodeMap.get(rel.target);

                    if (sourceId && targetId) {
                        await db.graph.createEdge({
                            source_node_id: sourceId,
                            target_node_id: targetId,
                            relation_type: rel.type
                        });
                    }
                }

                results.processed++;
                results.details.push(`Processed memory ${memory.id}: ${entities.length} entities`);

            } catch (err: any) {
                console.error(`Error processing memory ${memory.id}:`, err);
                results.errors++;
                results.details.push(`Failed memory ${memory.id}: ${err.message}`);
            }
        }

        return NextResponse.json({
            success: true,
            results
        });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
