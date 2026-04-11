import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/supabase-server';
import { db } from '@/lib/supabase';

// DELETE /api/keys/[id] — Revoke an API key
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        await db.apiKeys.delete(id, session.user.id);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Delete API key error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to delete API key' },
            { status: 500 }
        );
    }
}
