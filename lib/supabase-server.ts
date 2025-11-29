import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ztzjgddyyypbegobzuuz.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0empnZGR5eXlwYmVnb2J6dXV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzOTU1NDksImV4cCI6MjA3OTk3MTU0OX0.hzqzEYs1GUEpIlyd1Z4wP8_t78GSuF5McZLNOopBKQI';

// Server client for server components and API routes
export async function createServerComponentClient() {
    const cookieStore = await cookies();

    return createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll() {
                return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    );
                } catch {
                    // The `setAll` method was called from a Server Component.
                    // This can be ignored if you have middleware refreshing
                    // user sessions.
                }
            },
        },
    });
}

// Server-side session helper for API routes
export async function getServerSession() {
    const supabase = await createServerComponentClient();

    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;

    return session;
}
