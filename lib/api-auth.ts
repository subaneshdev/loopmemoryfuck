import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * API Key Authentication & Rate Limiting for LoopMemory Public API
 * 
 * Keys are formatted as: lm_sk_<32-char-random>
 * Stored as SHA-256 hash in the database.
 * Rate limiting uses a simple in-memory counter.
 */

// --- In-memory rate limiter ---
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(keyId: string, limit: number): { allowed: boolean; remaining: number; resetAt: number } {
    const now = Date.now();
    const windowMs = 60_000; // 1 minute window

    let entry = rateLimitStore.get(keyId);

    if (!entry || now > entry.resetAt) {
        entry = { count: 0, resetAt: now + windowMs };
        rateLimitStore.set(keyId, entry);
    }

    entry.count++;

    return {
        allowed: entry.count <= limit,
        remaining: Math.max(0, limit - entry.count),
        resetAt: entry.resetAt,
    };
}

// Clean up stale entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore) {
        if (now > entry.resetAt) {
            rateLimitStore.delete(key);
        }
    }
}, 5 * 60_000);

// --- Key hashing ---
async function hashApiKey(key: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// --- Key generation ---
export function generateApiKey(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const randomValues = new Uint8Array(32);
    crypto.getRandomValues(randomValues);
    for (let i = 0; i < 32; i++) {
        result += chars[randomValues[i] % chars.length];
    }
    return `lm_sk_${result}`;
}

// --- Auth result type ---
export interface ApiAuthResult {
    success: boolean;
    userId?: string;
    keyId?: string;
    error?: string;
    statusCode?: number;
    rateLimitHeaders?: Record<string, string>;
}

// --- Main auth function ---
export async function authenticateApiKey(request: NextRequest): Promise<ApiAuthResult> {
    const apiKey = request.headers.get('X-API-Key') || request.headers.get('x-api-key');

    if (!apiKey) {
        return {
            success: false,
            error: 'Missing API key. Include X-API-Key header.',
            statusCode: 401,
        };
    }

    if (!apiKey.startsWith('lm_sk_')) {
        return {
            success: false,
            error: 'Invalid API key format. Keys start with lm_sk_',
            statusCode: 401,
        };
    }

    // Hash and lookup
    const keyHash = await hashApiKey(apiKey);

    const { data: keyRecord, error } = await supabase
        .from('api_keys')
        .select('id, user_id, scopes, rate_limit, expires_at')
        .eq('key_hash', keyHash)
        .single();

    if (error || !keyRecord) {
        return {
            success: false,
            error: 'Invalid API key.',
            statusCode: 401,
        };
    }

    // Check expiration
    if (keyRecord.expires_at && new Date(keyRecord.expires_at) < new Date()) {
        return {
            success: false,
            error: 'API key has expired.',
            statusCode: 401,
        };
    }

    // Rate limiting
    const rateLimit = keyRecord.rate_limit || 100;
    const rl = checkRateLimit(keyRecord.id, rateLimit);

    if (!rl.allowed) {
        return {
            success: false,
            error: 'Rate limit exceeded. Try again later.',
            statusCode: 429,
            rateLimitHeaders: {
                'X-RateLimit-Limit': String(rateLimit),
                'X-RateLimit-Remaining': '0',
                'X-RateLimit-Reset': String(Math.ceil(rl.resetAt / 1000)),
            },
        };
    }

    // Update last_used_at (fire and forget)
    supabase
        .from('api_keys')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', keyRecord.id)
        .then(() => {});

    return {
        success: true,
        userId: keyRecord.user_id,
        keyId: keyRecord.id,
        rateLimitHeaders: {
            'X-RateLimit-Limit': String(rateLimit),
            'X-RateLimit-Remaining': String(rl.remaining),
            'X-RateLimit-Reset': String(Math.ceil(rl.resetAt / 1000)),
        },
    };
}

// --- Usage logging (fire and forget) ---
export function logApiUsage(params: {
    apiKeyId: string;
    userId: string;
    endpoint: string;
    method: string;
    statusCode: number;
    responseTimeMs: number;
}) {
    supabase.from('api_usage').insert({
        api_key_id: params.apiKeyId,
        user_id: params.userId,
        endpoint: params.endpoint,
        method: params.method,
        status_code: params.statusCode,
        response_time_ms: params.responseTimeMs,
    }).then(() => {});
}

// --- Hash export for key creation ---
export { hashApiKey };
