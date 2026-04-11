import Razorpay from 'razorpay';

let razorpayInstance: Razorpay | null = null;

function getRazorpay(): Razorpay {
    if (!razorpayInstance) {
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
            throw new Error('Razorpay keys not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to environment variables.');
        }

        razorpayInstance = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });
    }
    return razorpayInstance;
}

export default getRazorpay;

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
