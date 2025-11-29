import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

// Browser client for client components
export function createClient() {
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Auth helpers for client-side
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
