import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export default razorpay;

// Plan configuration
export const PLANS = {
    pro: {
        name: 'Pro API',
        amount: 2900, // $29 in cents
        currency: 'USD',
        description: 'LoopMemory Pro API — 1M requests/month',
        features: [
            '1,000,000 requests / month',
            '500 requests / minute',
            'Advanced Graph Extraction',
            'Custom Namespaces',
            'Priority Email Support',
        ],
    },
} as const;

export type PlanId = keyof typeof PLANS;
