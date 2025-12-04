import { SignJWT, jwtVerify } from 'jose';
import { SupabaseClient } from '@supabase/supabase-js';
import { supabase as anonClient } from '@/lib/supabase';

// Secret for signing JWTs - in production, use env variable
const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key-change-in-production-min-32-chars-long'
);

const ALGORITHM = 'HS256';

// Generate a random authorization code
export function generateAuthCode(): string {
    return `auth_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
}

// Store authorization code in Supabase
export async function storeAuthCode(
    supabase: SupabaseClient,
    code: string,
    userId: string,
    email: string,
    redirectUri: string
): Promise<void> {
    const { error } = await supabase.from('oauth_codes').insert({
        code,
        user_id: userId,
        email,
        redirect_uri: redirectUri,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
    });

    if (error) throw error;
}

// Validate and consume authorization code using Supabase RPC
export async function validateAuthCode(code: string, redirectUri: string): Promise<{
    userId?: string;
    email?: string;
    error?: string;
}> {
    // Use the anon client to call the security definer function
    const { data, error } = await anonClient.rpc('verify_oauth_code', {
        input_code: code,
        input_redirect_uri: redirectUri
    });

    if (error) {
        console.error('Error verifying auth code:', error);
        return { error: `Database error: ${error.message}` };
    }

    if (!data) {
        return { error: 'Invalid code or redirect URI mismatch' };
    }

    return {
        userId: data.userId,
        email: data.email,
    };
}

// Generate JWT access token
export async function generateAccessToken(
    userId: string,
    email: string
): Promise<string> {
    const token = await new SignJWT({
        sub: userId,
        email: email,
    })
        .setProtectedHeader({ alg: ALGORITHM })
        .setIssuedAt()
        .setExpirationTime('24h') // Token valid for 24 hours
        .sign(JWT_SECRET);

    return token;
}

// Verify JWT access token
export async function verifyAccessToken(token: string): Promise<{
    userId: string;
    email: string;
} | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);

        return {
            userId: payload.sub as string,
            email: payload.email as string,
        };
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
}

export function extractBearerToken(authHeader: string | null): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7);
}
