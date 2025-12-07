import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from '@/lib/supabase-server';

// Initialize Supabase client with service role key for admin operations
// We need this to delete from the vector store (Pinecone) if we were syncing there,
// but for now we just delete from Supabase.
// Actually, we should use the authenticated client from the session if possible,
// but RLS might be tricky. Let's use the service role key but strictly check ownership.
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
