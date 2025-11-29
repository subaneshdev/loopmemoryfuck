import { NextResponse } from 'next/server';

// MCP Server Discovery Endpoint
export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://loopmemory.vercel.app';

    return NextResponse.json({
        name: 'LoopMemory',
        version: '1.0.0',
        description: 'Universal memory layer for AI assistants',
        capabilities: {
            tools: true,
        },
    });
}
