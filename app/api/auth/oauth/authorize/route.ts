import { NextRequest, NextResponse } from 'next/server';
import { generateAuthCode, storeAuthCode } from '@/lib/oauth';
import { getServerSession } from '@/lib/supabase-server';
import { createClient } from '@supabase/supabase-js';

// POST /api/auth/oauth/authorize - Generate authorization code
export async function POST(request: NextRequest) {
    try {
        console.log('[Authorize] Starting authorization request');

        // Get authenticated user session
        const session = await getServerSession();
        if (!session || !session.user) {
            console.error('[Authorize] No session found');
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }
        console.log('[Authorize] Session found for user:', session.user.id);

        const body = await request.json();
        const { redirect_uri } = body;

        // Validate inputs
        if (!redirect_uri) {
            console.error('[Authorize] Missing redirect_uri');
            return NextResponse.json(
                { success: false, error: 'Missing redirect_uri' },
                { status: 400 }
            );
        }

        // Create authenticated Supabase client to insert code
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        console.log('[Authorize] Creating Supabase client with token');

        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: `Bearer ${session.access_token}` } }
        });

        // Generate authorization code
        const code = generateAuthCode();
        console.log('[Authorize] Generated code:', code.substring(0, 5) + '...');

        // Store code with user info in DB
        try {
            await storeAuthCode(supabase, code, session.user.id, session.user.email!, redirect_uri);
            console.log('[Authorize] Code stored successfully');
        } catch (dbError: any) {
            console.error('[Authorize] DB Error storing code:', dbError);
            throw dbError;
        }

        return NextResponse.json({
            success: true,
            code,
        });
    } catch (error: any) {
        console.error('[Authorize] Authorization error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Authorization failed' },
            { status: 500 }
        );
    }
}

// GET /api/auth/oauth/authorize - Show authorization page
// This is handled by the page.tsx file in the same directory
export async function GET(request: NextRequest) {
    // The actual page is rendered by Next.js
    // This endpoint can be used for server-side validation if needed
    return new NextResponse('Use the authorization page', { status: 200 });
}
