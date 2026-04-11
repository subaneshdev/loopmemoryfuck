import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST /api/waitlist — Join the waitlist
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, name, useCase, planInterest } = body;

        if (!email || typeof email !== 'string' || !email.includes('@')) {
            return NextResponse.json(
                { success: false, error: 'Valid email is required' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('waitlist')
            .upsert(
                {
                    email: email.toLowerCase().trim(),
                    name: name || null,
                    use_case: useCase || null,
                    plan_interest: planInterest || 'pro',
                    source: 'pricing_page',
                },
                { onConflict: 'email' }
            )
            .select()
            .single();

        if (error) {
            console.error('Waitlist insert error:', error);
            return NextResponse.json(
                { success: false, error: 'Failed to join waitlist' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'You\'re on the list! We\'ll be in touch soon.',
        });
    } catch (error: any) {
        console.error('Waitlist error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Something went wrong' },
            { status: 500 }
        );
    }
}
