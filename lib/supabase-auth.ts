import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ztzjgddyyypbegobzuuz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0empnZGR5eXlwYmVnb2J6dXV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzOTU1NDksImV4cCI6MjA3OTk3MTU0OX0.hzqzEYs1GUEpIlyd1Z4wP8_t78GSuF5McZLNOopBKQI';

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
