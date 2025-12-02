import { NextRequest } from 'next/server';
import { getServerSession } from '@/lib/supabase-server';
import { extractBearerToken, verifyAccessToken } from '@/lib/oauth';
import { db } from '@/lib/supabase';
import { vectorStore } from '@/lib/pinecone';
import { generateEmbedding } from '@/lib/gemini';
import { generateId } from '@/lib/utils';
import type { MCPAddMemoryArgs, MCPSearchMemoriesArgs } from '@/types';

// MCP Tool Definitions
const TOOLS = [
    {
        name: 'addMemory',
        description: 'Store a new memory in the memory system',
        inputSchema: {
            type: 'object',
            properties: {
                text: {
                    type: 'string',
                    description: 'The content of the memory to store',
                },
                source: {
                    type: 'string',
                    description: 'Optional source or context for the memory',
                },
                projectId: {
                    type: 'string',
                    description: 'Optional project ID to associate the memory with',
                },
                tags: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Optional tags for categorizing the memory',
                },
                metadata: {
                    type: 'object',
                    description: 'Optional additional metadata',
                },
            },
            required: ['text'],
        },
    },
    {
        name: 'searchMemories',
        description: 'Search memories using semantic similarity',
        inputSchema: {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'The search query to find relevant memories',
                },
                projectId: {
                    type: 'string',
                    description: 'Optional project ID to filter memories',
                },
                limit: {
                    type: 'number',
                    description: 'Maximum number of results to return (default: 10)',
                    default: 10,
                },
                minScore: {
                    type: 'number',
                    description: 'Minimum similarity score (0-1) for results (default: 0.7)',
                    default: 0.7,
                },
            },
            required: ['query'],
        },
    },
    {
        name: 'whoAmI',
        description: 'Get information about the current user',
        inputSchema: {
            type: 'object',
            properties: {},
        },
    },
    {
        name: 'getProjects',
        description: 'List all projects for the current user',
        inputSchema: {
            type: 'object',
            properties: {},
        },
    },
];

// Get authenticated user
async function getAuthenticatedUser(request: NextRequest) {
    // Try OAuth token first
    const authHeader = request.headers.get('Authorization');
    const token = extractBearerToken(authHeader);

    if (token) {
        const tokenData = await verifyAccessToken(token);
        if (tokenData) {
            return {
                userId: tokenData.userId,
                userEmail: tokenData.email,
            };
        }
    }

    // Fallback to session
    const session = await getServerSession();
    return {
        userId: session?.user?.id || '00000000-0000-0000-0000-000000000000',
        userEmail: session?.user?.email || 'default@example.com',
    };
}

// Handle MCP tool execution
async function executeTool(name: string, args: any, userId: string, userEmail: string, request: NextRequest) {
    switch (name) {
        case 'addMemory': {
            const { text, source, projectId, tags, metadata } = args as MCPAddMemoryArgs;

            const embedding = await generateEmbedding(text);
            const vectorId = generateId();

            // 1. Create memory in Supabase first to get the UUID
            const memory = await db.memories.create({
                user_id: userId,
                project_id: projectId,
                content: text,
                source,
                metadata: { ...metadata, tags: tags || [] },
                vector_id: vectorId,
            });

            // 2. Upsert to Pinecone with the correct Supabase memoryId
            await vectorStore.upsert(vectorId, embedding, {
                userId,
                projectId: projectId || '',
                memoryId: memory.id, // Store the REAL Supabase UUID
                text: text.substring(0, 500),
            });

            return {
                content: [
                    {
                        type: 'text',
                        text: `Memory created successfully with ID: ${memory.id}`,
                    },
                ],
            };
        }

        case 'searchMemories': {
            const { query, projectId, limit = 10, minScore = 0.0 } = args as MCPSearchMemoriesArgs;

            console.log(`[Search] Query: "${query}" | User: ${userId} | Project: ${projectId || 'all'}`);

            const queryEmbedding = await generateEmbedding(query);
            const matches = await vectorStore.query(
                queryEmbedding,
                { userId, projectId },
                limit
            );

            console.log(`[Search] Pinecone found ${matches.length} matches`);

            const results = [];
            for (const match of matches) {
                console.log(`[Search] Match: ${match.id} | Score: ${match.score} | MemoryID: ${match.metadata?.memoryId}`);

                if (match.score && match.score >= minScore) {
                    try {
                        const memoryId = match.metadata?.memoryId as string;
                        if (!memoryId) {
                            console.warn(`[Search] Missing memoryId in metadata for match ${match.id}`);
                            continue;
                        }

                        const memory = await db.memories.findById(memoryId);
                        results.push({
                            id: memory.id,
                            content: memory.content,
                            source: memory.source,
                            score: match.score,
                            createdAt: memory.created_at,
                        });
                    } catch (error) {
                        console.warn(`[Search] Memory lookup failed for ID ${match.metadata?.memoryId}:`, error);
                    }
                }
            }

            console.log(`[Search] Returning ${results.length} results`);

            if (results.length === 0) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                message: "No memories found matching your query.",
                                debug_info: {
                                    query,
                                    userId,
                                    projectId: projectId || null,
                                    pinecone_matches: matches.length,
                                    top_match_score: matches.length > 0 ? matches[0].score : 0,
                                    top_match_memory_id: matches.length > 0 ? matches[0].metadata?.memoryId : null
                                }
                            }, null, 2),
                        },
                    ],
                };
            }

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            results,
                            debug_info: {
                                query,
                                userId,
                                projectId: projectId || null,
                                pinecone_matches: matches.length,
                                top_match_score: matches.length > 0 ? matches[0].score : 0,
                                top_match_memory_id: matches.length > 0 ? matches[0].metadata?.memoryId : null
                            }
                        }, null, 2),
                    },
                ],
            };
        }

        case 'whoAmI': {
            const authHeader = request.headers.get('Authorization');
            const cookieHeader = request.headers.get('cookie');

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({
                            id: userId,
                            email: userEmail,
                            debug_auth: {
                                has_auth_header: !!authHeader,
                                auth_header_start: authHeader ? authHeader.substring(0, 10) + '...' : null,
                                has_cookie: !!cookieHeader,
                                is_default_user: userId === '00000000-0000-0000-0000-000000000000',
                                timestamp: new Date().toISOString()
                            }
                        }, null, 2),
                    },
                ],
            };
        }

        case 'getProjects': {
            const projects = await db.projects.findByUserId(userId);

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(projects, null, 2),
                    },
                ],
            };
        }

        default:
            throw new Error(`Unknown tool: ${name}`);
    }
}

// GET endpoint for SSE connection
export async function GET(request: NextRequest) {
    // Set SSE headers
    const responseHeaders = {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
    };

    // Create a readable stream for SSE
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            // Send initial connection message
            const message = {
                jsonrpc: '2.0',
                method: 'connected',
                params: {
                    serverInfo: {
                        name: 'LoopMemory',
                        version: '1.0.0',
                    },
                    capabilities: {
                        tools: true,
                    },
                },
            };

            controller.enqueue(encoder.encode(`data: ${JSON.stringify(message)}\n\n`));

            // Keep the connection alive with heartbeat
            const interval = setInterval(() => {
                try {
                    controller.enqueue(encoder.encode(': heartbeat\n\n'));
                } catch (e) {
                    clearInterval(interval);
                }
            }, 15000); // Every 15 seconds

            // Handle client disconnect
            request.signal.addEventListener('abort', () => {
                clearInterval(interval);
                controller.close();
            });
        },
    });

    return new Response(stream, { headers: responseHeaders });
}

// POST endpoint for JSON-RPC requests  
export async function POST(request: NextRequest) {
    try {
        const { userId, userEmail } = await getAuthenticatedUser(request);

        const body = await request.json();
        const { method, params, id } = body;

        // Handle initialize request
        if (method === 'initialize') {
            return Response.json({
                jsonrpc: '2.0',
                id,
                result: {
                    protocolVersion: '2024-11-05',
                    capabilities: {
                        tools: {},
                    },
                    serverInfo: {
                        name: 'LoopMemory',
                        version: '1.0.0',
                    },
                },
            });
        }

        // Handle initialized notification
        if (method === 'notifications/initialized') {
            return Response.json({
                jsonrpc: '2.0',
                id,
                result: {},
            });
        }

        // Handle tools/list request
        if (method === 'tools/list') {
            return Response.json({
                jsonrpc: '2.0',
                id,
                result: {
                    tools: TOOLS,
                },
            });
        }

        // Handle tools/call request
        if (method === 'tools/call') {
            const { name, arguments: args } = params;

            try {
                const result = await executeTool(name, args, userId, userEmail, request);

                return Response.json({
                    jsonrpc: '2.0',
                    id,
                    result,
                });
            } catch (error: any) {
                return Response.json({
                    jsonrpc: '2.0',
                    id,
                    error: {
                        code: -32000,
                        message: error.message || 'Tool execution failed',
                    },
                }, { status: 500 });
            }
        }

        return Response.json({
            jsonrpc: '2.0',
            id,
            error: {
                code: -32601,
                message: 'Method not found',
            },
        }, { status: 400 });
    } catch (error: any) {
        console.error('MCP error:', error);
        return Response.json({
            jsonrpc: '2.0',
            id: null,
            error: {
                code: -32603,
                message: error.message || 'Internal error',
            },
        }, { status: 500 });
    }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
    return new Response(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}
