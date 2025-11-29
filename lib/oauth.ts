import { SignJWT, jwtVerify } from 'jose';

// Secret for signing JWTs - in production, use env variable
const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key-change-in-production-min-32-chars-long'
);

const ALGORITHM = 'HS256';

// Authorization code storage (in-memory for now, use Redis in production)
const authCodes = new Map<string, {
    userId: string;
    email: string;
    expiresAt: number;
    redirectUri: string;
}>();

// Generate a random authorization code
export function generateAuthCode(): string {
    return `auth_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
}

// Store authorization code
export function storeAuthCode(
    code: string,
    userId: string,
    email: string,
    redirectUri: string
): void {
    authCodes.set(code, {
        userId,
        email,
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
        redirectUri,
    });
}

// Validate and consume authorization code
export function validateAuthCode(code: string, redirectUri: string): {
    userId: string;
    email: string;
} | null {
    const authCode = authCodes.get(code);

    if (!authCode) {
        return null;
    }

    // Check expiration
    if (Date.now() > authCode.expiresAt) {
        authCodes.delete(code);
        return null;
    }

    // Check redirect URI matches
    if (authCode.redirectUri !== redirectUri) {
        return null;
    }

    // Consume the code (one-time use)
    authCodes.delete(code);

    return {
        userId: authCode.userId,
        email: authCode.email,
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

// Extract token from Authorization header
export function extractBearerToken(authHeader: string | null): string | null {
    if (!authHeader) {
        return null;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return null;
    }

    return parts[1];
}

// Clean up expired auth codes (run periodically)
export function cleanupExpiredCodes(): void {
    const now = Date.now();
    for (const [code, data] of authCodes.entries()) {
        if (now > data.expiresAt) {
            authCodes.delete(code);
        }
    }
}

// Run cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
    setInterval(cleanupExpiredCodes, 5 * 60 * 1000);
}
