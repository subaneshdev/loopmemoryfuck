import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/supabase-server';
import getRazorpay, { PLANS } from '@/lib/razorpay';

// POST /api/payments/create-order — Create a Razorpay order
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ success: false, error: 'Please sign in first' }, { status: 401 });
        }

        const body = await request.json();
        const { planId = 'pro' } = body;

        const plan = PLANS[planId as keyof typeof PLANS];
        if (!plan) {
            return NextResponse.json({ success: false, error: 'Invalid plan' }, { status: 400 });
        }

        const razorpay = getRazorpay();

        const order = await razorpay.orders.create({
            amount: plan.amount,
            currency: plan.currency,
            receipt: `lm_${session.user.id}_${Date.now()}`,
            notes: {
                userId: session.user.id,
                userEmail: session.user.email || '',
                planId,
            },
        });

        return NextResponse.json({
            success: true,
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
            },
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        });
    } catch (error: any) {
        console.error('Create Razorpay order error:', error);
        const message = error.message?.includes('Razorpay keys not configured')
            ? 'Payment system is being set up. Please try again later.'
            : error.message || 'Failed to create order';
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}
