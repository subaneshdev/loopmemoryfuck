import { createBrowserClient } from '@supabase/ssr';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY!;

// Browser client for client components
export function createClient() {
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

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

// Auth helpers
export async function signUp(email: string, password: string) {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) throw error;
    return data;
}

export async function signIn(email: string, password: string) {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;
    return data;
}

export async function signOut() {
    const supabase = createClient();

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

export async function getSession() {
    const supabase = createClient();

    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;

    return session;
}

export async function getUser() {
    const supabase = createClient();

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;

    return user;
}

// Server-side session helper for API routes
export async function getServerSession() {
    const supabase = await createServerComponentClient();

    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;

    return session;
}
