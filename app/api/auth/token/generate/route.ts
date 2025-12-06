import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/supabase-server';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key-change-in-production-min-32-chars-long'
);

const ALGORITHM = 'HS256';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session || !session.user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Generate a long-lived token (1 year)
        const token = await new SignJWT({
            sub: session.user.id,
            email: session.user.email,
        })
            .setProtectedHeader({ alg: ALGORITHM })
            .setIssuedAt()
            .setExpirationTime('1y') // 1 year
            .sign(JWT_SECRET);

        return NextResponse.json({
            success: true,
            token,
        });
    } catch (error: any) {
        console.error('Token generation error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to generate token' },
            { status: 500 }
        );
    }
}
