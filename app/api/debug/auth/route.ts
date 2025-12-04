import { NextResponse } from 'next/server';
import { supabase as anonClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Try to select from the table
        // If table doesn't exist, this will throw an error
        const { data, error } = await anonClient
            .from('oauth_codes')
            .select('count')
            .limit(1);

        if (error) {
            return NextResponse.json({
                status: 'error',
                message: error.message,
                details: error,
                hint: 'If message says "relation does not exist", you MUST run the SQL migration.'
            }, { status: 500 });
        }

        // Also check if the RPC function exists
        const { error: rpcError } = await anonClient.rpc('verify_oauth_code', {
            input_code: 'test',
            input_redirect_uri: 'test'
        });

        // The RPC might return null (success but no code found) or error (function not found)
        // If function missing: "function verify_oauth_code(text, text) does not exist"

        if (rpcError && rpcError.message.includes('does not exist')) {
            return NextResponse.json({
                status: 'error',
                message: 'RPC function missing',
                details: rpcError,
                hint: 'You ran the table SQL but missed the function definition.'
            }, { status: 500 });
        }

        return NextResponse.json({
            status: 'success',
            message: 'OAuth table and functions appear to be set up correctly.',
            table_check: 'OK',
            function_check: 'OK (or at least exists)'
        });

    } catch (e: any) {
        return NextResponse.json({
            status: 'error',
            message: e.message,
            hint: 'Unexpected error.'
        }, { status: 500 });
    }
}
