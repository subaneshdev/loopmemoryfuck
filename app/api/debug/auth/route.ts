import { NextResponse } from 'next/server';
import { supabase as anonClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Try to select from the table
        const { data: codes, error } = await anonClient
            .from('oauth_codes')
            .select('created_at, redirect_uri')
            .order('created_at', { ascending: false })
            .limit(5);

        if (error) {
            return NextResponse.json({
                status: 'error',
                message: error.message,
                details: error,
                hint: 'If message says "relation does not exist", you MUST run the SQL migration.'
            }, { status: 500 });
        }

        return NextResponse.json({
            status: 'success',
            version: 'v2-no-guest',
            message: 'OAuth table is accessible.',
            stats: {
                total_codes_found: codes.length,
                last_code_created_at: codes.length > 0 ? codes[0].created_at : 'never',
                last_code_redirect_uri: codes.length > 0 ? codes[0].redirect_uri : null
            },
            function_check: 'Pending check...'
        });

        // Also check if the RPC function exists
        const { error: rpcError } = await anonClient.rpc('verify_oauth_code', {
            input_code: 'test',
            input_redirect_uri: 'test'
        });

        // The RPC might return null (success but no code found) or error (function not found)
        // If function missing: "function verify_oauth_code(text, text) does not exist"

        if (rpcError?.message?.includes('does not exist')) {
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
