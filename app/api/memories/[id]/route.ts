import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from '@/lib/supabase-server';

// Helper to get admin client lazily
const getSupabaseAdmin = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        throw new Error('Missing Supabase credentials');
    }

    return createClient(url, key);
};

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession();
        if (!session || !session.user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await params;

        // Initialize admin client lazily to avoid build-time errors
        const supabaseAdmin = getSupabaseAdmin();

        // Verify ownership before deleting
        const { data: memory, error: fetchError } = await supabaseAdmin
            .from('memories')
            .select('user_id')
            .eq('id', id)
            .single();

        if (fetchError || !memory) {
            return NextResponse.json(
                { success: false, error: 'Memory not found' },
                { status: 404 }
            );
        }

        if (memory.user_id !== session.user.id) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 403 }
            );
        }

        // Delete the memory
        const { error: deleteError } = await supabaseAdmin
            .from('memories')
            .delete()
            .eq('id', id);

        if (deleteError) {
            throw deleteError;
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting memory:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete memory' },
            { status: 500 }
        );
    }
}
