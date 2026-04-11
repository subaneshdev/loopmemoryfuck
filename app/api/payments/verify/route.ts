import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/supabase-server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

// POST /api/payments/verify — Verify Razorpay payment signature
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId = 'pro' } = body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json(
                { success: false, error: 'Missing payment details' },
                { status: 400 }
            );
        }

        // Verify signature
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return NextResponse.json(
                { success: false, error: 'Invalid payment signature' },
                { status: 400 }
            );
        }

        // Payment is verified — store subscription in database
        const { error } = await supabase.from('subscriptions').upsert({
            user_id: session.user.id,
            plan_id: planId,
            status: 'active',
            razorpay_order_id,
            razorpay_payment_id,
            started_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        }, { onConflict: 'user_id' });

        if (error) {
            console.error('Subscription upsert error:', error);
            return NextResponse.json(
                { success: false, error: 'Failed to activate subscription' },
                { status: 500 }
            );
        }

        // Upgrade API key rate limits for this user
        await supabase
            .from('api_keys')
            .update({ rate_limit: 500 })
            .eq('user_id', session.user.id);

        return NextResponse.json({
            success: true,
            message: 'Payment verified. Pro plan activated!',
            subscription: {
                plan: planId,
                status: 'active',
            },
        });
    } catch (error: any) {
        console.error('Payment verification error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Verification failed' },
            { status: 500 }
        );
    }
}
