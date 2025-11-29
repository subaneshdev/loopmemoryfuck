import { NextRequest, NextResponse } from 'next/server';
import { validateAuthCode, generateAccessToken } from '@/lib/oauth';

// POST /api/auth/oauth/token - Exchange authorization code for access token
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { grant_type, code, redirect_uri } = body;

        // Validate grant type
        if (grant_type !== 'authorization_code') {
            return NextResponse.json(
                { error: 'unsupported_grant_type', error_description: 'Only authorization_code grant type is supported' },
                { status: 400 }
            );
        }

        // Validate parameters
        if (!code || !redirect_uri) {
            return NextResponse.json(
                { error: 'invalid_request', error_description: 'Missing required parameters' },
                { status: 400 }
            );
        }

        // Validate and consume authorization code
        const authData = validateAuthCode(code, redirect_uri);

        if (!authData) {
            return NextResponse.json(
                { error: 'invalid_grant', error_description: 'Invalid or expired authorization code' },
                { status: 400 }
            );
        }

        // Generate access token
        const accessToken = await generateAccessToken(authData.userId, authData.email);

        return NextResponse.json({
            access_token: accessToken,
            token_type: 'Bearer',
            expires_in: 86400, // 24 hours in seconds
            user_id: authData.userId,
            email: authData.email,
        });
    } catch (error: any) {
        console.error('Token exchange error:', error);
        return NextResponse.json(
            { error: 'server_error', error_description: error.message || 'Token exchange failed' },
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
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}
