import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ztzjgddyyypbegobzuuz.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0empnZGR5eXlwYmVnb2J6dXV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzOTU1NDksImV4cCI6MjA3OTk3MTU0OX0.hzqzEYs1GUEpIlyd1Z4wP8_t78GSuF5McZLNOopBKQI';

// if (!supabaseUrl || !supabaseKey) {
//     throw new Error('Missing Supabase environment variables');
// }

export const supabase = createClient(supabaseUrl, supabaseKey);

// Type-safe database helpers
export const db = {
    memories: {
        async create(memory: {
            user_id: string;
            project_id?: string;
            content: string;
            source?: string;
            metadata?: Record<string, any>;
            vector_id?: string;
        }) {
            const { data, error } = await supabase
                .from('memories')
                .insert(memory)
                .select()
                .single();

            if (error) throw error;
            return data;
        },

        async findById(id: string) {
            const { data, error } = await supabase
                .from('memories')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        },

        async findByUserId(userId: string, projectId?: string, limit = 50, offset = 0) {
            let query = supabase
                .from('memories')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1);

            if (projectId) {
                query = query.eq('project_id', projectId);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data || [];
        },

        async update(id: string, updates: {
            content?: string;
            source?: string;
            metadata?: Record<string, any>;
            vector_id?: string;
        }) {
            const { data, error } = await supabase
                .from('memories')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },

        async delete(id: string) {
            const { error } = await supabase
                .from('memories')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
    },

    projects: {
        async create(project: {
            user_id: string;
            name: string;
            description?: string;
        }) {
            const { data, error } = await supabase
                .from('projects')
                .insert(project)
                .select()
                .single();

            if (error) throw error;
            return data;
        },

        async findByUserId(userId: string) {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        },

        async findById(id: string) {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        },

        async update(id: string, updates: {
            name?: string;
            description?: string;
        }) {
            const { data, error } = await supabase
                .from('projects')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },

        async delete(id: string) {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
    },

    documents: {
        async create(document: {
            user_id: string;
            project_id?: string;
            title?: string;
            content: string;
            url?: string;
            metadata?: Record<string, any>;
        }) {
            const { data, error } = await supabase
                .from('documents')
                .insert(document)
                .select()
                .single();

            if (error) throw error;
            return data;
        },

        async findByUserId(userId: string, limit = 50, offset = 0) {
            const { data, error } = await supabase
                .from('documents')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1);

            if (error) throw error;
            return data || [];
        },

        async delete(id: string) {
            const { error } = await supabase
                .from('documents')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
    },

    users: {
        async findByEmail(email: string) {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
            return data;
        },

        async create(email: string) {
            const { data, error } = await supabase
                .from('users')
                .insert({ email })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
    },
};
