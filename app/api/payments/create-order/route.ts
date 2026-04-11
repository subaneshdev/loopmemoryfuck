import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/supabase-server';
import razorpay, { PLANS } from '@/lib/razorpay';

// POST /api/payments/create-order — Create a Razorpay order
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { planId = 'pro' } = body;

        const plan = PLANS[planId as keyof typeof PLANS];
        if (!plan) {
            return NextResponse.json({ success: false, error: 'Invalid plan' }, { status: 400 });
        }

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
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to create order' },
            { status: 500 }
        );
    }
}
