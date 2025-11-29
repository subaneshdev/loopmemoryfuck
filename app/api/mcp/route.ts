import { NextRequest, NextResponse } from 'next/server';
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

// Handle MCP requests
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { method, params } = body;

        // Handle tools/list request
        if (method === 'tools/list') {
            return NextResponse.json({
                tools: TOOLS,
            });
        }

        // Handle tools/call request
        if (method === 'tools/call') {
            const { name, arguments: args } = params;
            const userId = '00000000-0000-0000-0000-000000000000'; // In production, get from auth

            switch (name) {
                case 'addMemory': {
                    const { text, source, projectId, tags, metadata } = args as MCPAddMemoryArgs;

                    // Generate embedding
                    const embedding = await generateEmbedding(text);
                    const vectorId = generateId();

                    // Store in Pinecone
                    await vectorStore.upsert(vectorId, embedding, {
                        userId,
                        projectId: projectId || '',
                        memoryId: vectorId,
                        text: text.substring(0, 500),
                    });

                    // Store in Supabase
                    const memory = await db.memories.create({
                        user_id: userId,
                        project_id: projectId,
                        content: text,
                        source,
                        metadata: { ...metadata, tags: tags || [] },
                        vector_id: vectorId,
                    });

                    return NextResponse.json({
                        content: [
                            {
                                type: 'text',
                                text: `Memory created successfully with ID: ${memory.id}`,
                            },
                        ],
                    });
                }

                case 'searchMemories': {
                    const { query, projectId, limit = 10, minScore = 0.7 } = args as MCPSearchMemoriesArgs;

                    // Generate query embedding
                    const queryEmbedding = await generateEmbedding(query);

                    // Search Pinecone
                    const matches = await vectorStore.query(
                        queryEmbedding,
                        { userId, projectId },
                        limit
                    );

                    // Fetch full memories
                    const results = [];
                    for (const match of matches) {
                        if (match.score && match.score >= minScore) {
                            try {
                                const memory = await db.memories.findById(match.metadata?.memoryId as string);
                                results.push({
                                    id: memory.id,
                                    content: memory.content,
                                    source: memory.source,
                                    score: match.score,
                                    createdAt: memory.created_at,
                                });
                            } catch (error) {
                                console.warn(`Memory not found for vector ${match.id}`);
                            }
                        }
                    }

                    return NextResponse.json({
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(results, null, 2),
                            },
                        ],
                    });
                }

                case 'whoAmI': {
                    // In production, fetch actual user data
                    return NextResponse.json({
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify({
                                    id: userId,
                                    email: 'user@example.com',
                                    message: 'This is a default user. In production, this would show actual user data.',
                                }, null, 2),
                            },
                        ],
                    });
                }

                case 'getProjects': {
                    const projects = await db.projects.findByUserId(userId);

                    return NextResponse.json({
                        content: [
                            {
                                type: 'text',
                                text: JSON.stringify(projects, null, 2),
                            },
                        ],
                    });
                }

                default:
                    return NextResponse.json(
                        { error: `Unknown tool: ${name}` },
                        { status: 400 }
                    );
            }
        }

        return NextResponse.json(
            { error: 'Invalid MCP request' },
            { status: 400 }
        );
    } catch (error: any) {
        console.error('MCP error:', error);
        return NextResponse.json(
            { error: error.message || 'MCP request failed' },
            { status: 500 }
        );
    }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}
