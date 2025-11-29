import { NextRequest, NextResponse } from 'next/server';
import { generateAuthCode, storeAuthCode } from '@/lib/oauth';

// POST /api/auth/oauth/authorize - Generate authorization code
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { user_id, email, redirect_uri } = body;

        // Validate inputs
        if (!user_id || !email || !redirect_uri) {
            return NextResponse.json(
                { success: false, error: 'Missing required parameters' },
                { status: 400 }
            );
        }

        // Generate authorization code
        const code = generateAuthCode();

        // Store code with user info
        storeAuthCode(code, user_id, email, redirect_uri);

        return NextResponse.json({
            success: true,
            code,
        });
    } catch (error: any) {
        console.error('Authorization error:', error);
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
