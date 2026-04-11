import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/supabase-server';
import { db } from '@/lib/supabase';
import { generateApiKey, hashApiKey } from '@/lib/api-auth';

// POST /api/keys — Generate a new API key
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        const body = await request.json();
        const { name = 'Default Key' } = body;

        // Generate key
        const rawKey = generateApiKey();
        const keyHash = await hashApiKey(rawKey);
        const keyPrefix = rawKey.substring(0, 12) + '...';

        // Store in DB
        const record = await db.apiKeys.create({
            user_id: userId,
            name,
            key_hash: keyHash,
            key_prefix: keyPrefix,
        });

        // Return the raw key ONLY on creation
        return NextResponse.json({
            success: true,
            key: rawKey,
            apiKey: {
                id: record.id,
                name: record.name,
                prefix: keyPrefix,
                created_at: record.created_at,
            },
            warning: 'Save this key now. It will not be shown again.',
        }, { status: 201 });
    } catch (error: any) {
        console.error('Create API key error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to create API key' },
            { status: 500 }
        );
    }
}

// GET /api/keys — List user's API keys (prefix only)
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const keys = await db.apiKeys.findByUserId(session.user.id);

        return NextResponse.json({
            success: true,
            keys,
        });
    } catch (error: any) {
        console.error('List API keys error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to list API keys' },
            { status: 500 }
        );
    }
}
