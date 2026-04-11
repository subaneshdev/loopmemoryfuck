'use client';

import { useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { Brain, Check, HelpCircle, X, Loader2, Sparkles, Rocket, PartyPopper } from 'lucide-react';
import { useAuth } from '@/app/providers/auth-provider';
import { useRouter } from 'next/navigation';

declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function PricingPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Waitlist state
    const [waitlistEmail, setWaitlistEmail] = useState('');
    const [waitlistName, setWaitlistName] = useState('');
    const [waitlistUseCase, setWaitlistUseCase] = useState('');
    const [waitlistLoading, setWaitlistLoading] = useState(false);
    const [waitlistSuccess, setWaitlistSuccess] = useState(false);
    const [waitlistError, setWaitlistError] = useState('');

    const handleProUpgrade = async () => {
        if (!user) {
            router.push('/login');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/payments/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId: 'pro' }),
            });
            const data = await res.json();

            if (!data.success) {
                alert(data.error || 'Failed to create order');
                setLoading(false);
                return;
            }

            const options = {
                key: data.key,
                amount: data.order.amount,
                currency: data.order.currency,
                name: 'LoopMemory',
                description: 'Pro API Plan — $29/mo',
                order_id: data.order.id,
                prefill: { email: user.email },
                theme: { color: '#2563eb' },
                handler: async function (response: any) {
                    const verifyRes = await fetch('/api/payments/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            planId: 'pro',
                        }),
                    });
                    const verifyData = await verifyRes.json();
                    if (verifyData.success) {
                        setSuccess(true);
                        setTimeout(() => router.push('/developer'), 2000);
                    } else {
                        alert('Payment verification failed: ' + (verifyData.error || 'Unknown error'));
                    }
                },
                modal: { ondismiss: () => setLoading(false) },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
            setLoading(false);
        } catch (error: any) {
            console.error('Payment error:', error);
            alert('Payment failed: ' + error.message);
            setLoading(false);
        }
    };

    const handleWaitlistSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!waitlistEmail) return;

        setWaitlistLoading(true);
        setWaitlistError('');

        try {
            const res = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: waitlistEmail,
                    name: waitlistName,
                    useCase: waitlistUseCase,
                    planInterest: 'pro',
                }),
            });
            const data = await res.json();

            if (data.success) {
                setWaitlistSuccess(true);
            } else {
                setWaitlistError(data.error || 'Something went wrong');
            }
        } catch {
            setWaitlistError('Network error. Please try again.');
        } finally {
            setWaitlistLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-slate-950 flex flex-col relative overflow-hidden">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

            {/* Background */}
            <div className="fixed inset-0 bg-grid-white pointer-events-none z-0 opacity-60" />
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-100/40 blur-[120px] pointer-events-none -z-10" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-slate-100/50 blur-[100px] pointer-events-none -z-10" />

            {/* Success Overlay */}
            {success && (
                <div className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center animate-fade-in-up">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-bold font-heading mb-2">Welcome to Pro! 🎉</h2>
                        <p className="text-slate-500">Redirecting to your Developer Console...</p>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className="glass border-b border-slate-200/60 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Brain className="text-white w-5 h-5" />
                        </div>
                        <span className="text-lg font-bold font-heading tracking-tight">LoopMemory</span>
                    </Link>
                    <div className="flex items-center gap-2 sm:gap-4">
                        <Link href="/docs" className="hidden sm:block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Docs</Link>
                        <Link href="/developer" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Console</Link>
                        {user ? (
                            <Link href="/dashboard" className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-full hover:bg-slate-800 transition-colors">
                                Dashboard
                            </Link>
                        ) : (
                            <Link href="/login" className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-full hover:bg-slate-800 transition-colors">
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 w-full z-10">
                {/* Hero */}
                <div className="max-w-3xl mx-auto text-center mb-20">
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold font-heading tracking-tight text-slate-900 mb-6">
                        Pricing that scales with your{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">agents.</span>
                    </h1>
                    <p className="text-base sm:text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
                        Start for free, then transparently upgrade as your AI agents demand more context and higher throughput.
                    </p>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto mb-16 sm:mb-24">
                    {/* Starter */}
                    <div className="premium-card p-8 flex flex-col relative bg-white border-slate-200 hover:-translate-y-1 transition-transform duration-300">
                        <h3 className="text-xl font-bold font-heading">Starter</h3>
                        <p className="text-slate-500 text-sm mt-2 mb-6">For hobbyists and side projects.</p>
                        <div className="mb-6">
                            <span className="text-4xl font-bold font-heading">$0</span>
                            <span className="text-slate-400">/mo</span>
                        </div>
                        <Link href="/signup" className="w-full py-3 bg-slate-100 text-slate-900 font-bold rounded-xl text-center hover:bg-slate-200 transition-colors mb-8 block">
                            Start for free
                        </Link>
                        <ul className="space-y-4 flex-1">
                            <FeatureItem included text="10,000 requests / month" />
                            <FeatureItem included text="100 requests / minute" />
                            <FeatureItem included text="Standard Context Search" />
                            <FeatureItem included={false} text="Graph Extraction" />
                            <FeatureItem included text="Community Discord Support" />
                        </ul>
                    </div>

                    {/* Pro (Highlighted) */}
                    <div className="premium-card p-8 flex flex-col relative border-blue-500 shadow-2xl shadow-blue-500/20 transform md:scale-105 z-10 bg-white">
                        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-2xl" />
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold rounded-full uppercase tracking-widest shadow-lg">
                            Most Popular
                        </div>
                        <h3 className="text-xl font-bold font-heading text-blue-900">Pro API</h3>
                        <p className="text-slate-500 text-sm mt-2 mb-6">For production applications.</p>
                        <div className="mb-6">
                            <span className="text-4xl font-bold font-heading">$29</span>
                            <span className="text-slate-400">/mo</span>
                        </div>
                        <button
                            onClick={handleProUpgrade}
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl text-center hover:opacity-90 transition-opacity mb-8 shadow-lg shadow-blue-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                            ) : (
                                'Upgrade to Pro'
                            )}
                        </button>
                        <ul className="space-y-4 flex-1">
                            <FeatureItem included text="1,000,000 requests / month" highlight />
                            <FeatureItem included text="500 requests / minute" highlight />
                            <FeatureItem included text="Advanced Graph Extraction" highlight />
                            <FeatureItem included text="Custom Namespaces" highlight />
                            <FeatureItem included text="Priority Email Support" highlight />
                        </ul>
                    </div>

                    {/* Enterprise */}
                    <div className="premium-card p-8 flex flex-col relative bg-white border-slate-200 hover:-translate-y-1 transition-transform duration-300">
                        <h3 className="text-xl font-bold font-heading">Enterprise</h3>
                        <p className="text-slate-500 text-sm mt-2 mb-6">For scale and custom infrastructure.</p>
                        <div className="mb-6">
                            <span className="text-4xl font-bold font-heading">Custom</span>
                        </div>
                        <Link href="mailto:contact@loopmemory.ai" className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl text-center hover:bg-slate-800 transition-colors mb-8 block">
                            Contact Us
                        </Link>
                        <ul className="space-y-4 flex-1">
                            <FeatureItem included text="Custom request volumes" />
                            <FeatureItem included text="Unlimited rate limits" />
                            <FeatureItem included text="Dedicated Pinecone Env" />
                            <FeatureItem included text="Enterprise SLA" />
                            <FeatureItem included text="Dedicated Slack Channel" />
                        </ul>
                    </div>
                </div>

                {/* ============ WAITLIST SECTION ============ */}
                <section className="max-w-2xl mx-auto mb-24">
                    <div className="premium-card p-0 overflow-hidden relative">
                        <div className="h-1.5 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500" />

                        <div className="p-10 md:p-12">
                            {waitlistSuccess ? (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                                        <PartyPopper className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold font-heading mb-2">You&apos;re in! 🎉</h3>
                                    <p className="text-slate-500 max-w-sm mx-auto">
                                        We&apos;ll slide into your inbox when it&apos;s your turn. No spam, pinky promise.
                                    </p>
                                    <p className="text-xs text-slate-400 mt-4">(We don&apos;t even have a newsletter yet, so you&apos;re extra safe.)</p>
                                </div>
                            ) : (
                                <>
                                    <div className="text-center mb-8">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 text-violet-600 text-xs font-bold mb-4">
                                            <Sparkles className="w-3.5 h-3.5" />
                                            EARLY ACCESS
                                        </div>
                                        <h3 className="text-3xl font-bold font-heading mb-3">
                                            Not ready to commit?<br />
                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600">We get it.</span>
                                        </h3>
                                        <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                                            Join the waitlist and be the first to know when we launch new features.
                                            Plus, early birds get <span className="font-bold text-slate-700">3 months of Pro for free</span>.
                                            No strings, no carrier pigeons.
                                        </p>
                                    </div>

                                    <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                value={waitlistName}
                                                onChange={(e) => setWaitlistName(e.target.value)}
                                                placeholder="Your name (optional, but we like names)"
                                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 text-sm placeholder:text-slate-400 transition-all"
                                            />
                                            <input
                                                type="email"
                                                value={waitlistEmail}
                                                onChange={(e) => setWaitlistEmail(e.target.value)}
                                                placeholder="you@awesome.dev *"
                                                required
                                                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 text-sm placeholder:text-slate-400 transition-all"
                                            />
                                        </div>
                                        <textarea
                                            value={waitlistUseCase}
                                            onChange={(e) => setWaitlistUseCase(e.target.value)}
                                            placeholder="What are you building? (e.g., 'A chatbot that actually remembers users' or 'World domination, one vector at a time')"
                                            rows={3}
                                            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 text-sm placeholder:text-slate-400 resize-none transition-all"
                                        />

                                        {waitlistError && (
                                            <p className="text-red-500 text-sm font-medium">{waitlistError}</p>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={waitlistLoading || !waitlistEmail}
                                            className="w-full py-4 bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-violet-500/20 disabled:opacity-50 flex items-center justify-center gap-2 text-base"
                                        >
                                            {waitlistLoading ? (
                                                <><Loader2 className="w-4 h-4 animate-spin" /> Joining...</>
                                            ) : (
                                                <><Rocket className="w-4 h-4" /> Join the Waitlist — It&apos;s Free</>
                                            )}
                                        </button>
                                    </form>

                                    <p className="text-center text-xs text-slate-400 mt-5">
                                        ✨ 2,847 developers already on the list · No spam, ever · Unsubscribe anytime
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold font-heading text-center mb-10">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <FAQItem
                            question="How do you count a request?"
                            answer="A request is counted anytime you hit our /api/v1/memories or /api/v1/memories/search endpoints. Vector embeddings and graph extractions are included in this metric."
                        />
                        <FAQItem
                            question="What payment methods do you accept?"
                            answer="We accept all major credit/debit cards, UPI, net banking, and wallets through Razorpay. All payments are processed securely."
                        />
                        <FAQItem
                            question="Can I upgrade or downgrade at any time?"
                            answer="Yes, you can manage your billing cycle and switch tiers directly from the Developer Console. Changes take effect on your next billing cycle."
                        />
                        <FAQItem
                            question="Do you use my data for model training?"
                            answer="No. As an enterprise-grade utility, user data passed into LoopMemory is securely embedded and stored, but never used to train underlying foundational models."
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}

function FeatureItem({ included, text, highlight }: { included: boolean; text: string; highlight?: boolean }) {
    return (
        <li className="flex items-center gap-3">
            <div className="shrink-0">
                {included ? (
                    <Check className={`w-5 h-5 ${highlight ? 'text-blue-500' : 'text-green-500'}`} />
                ) : (
                    <X className="w-5 h-5 text-slate-300" />
                )}
            </div>
            <span className="text-slate-600 text-sm font-medium">{text}</span>
        </li>
    );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    return (
        <div className="premium-card p-6 cursor-pointer hover:bg-slate-50 transition-colors">
            <h4 className="font-bold flex items-center gap-2 mb-2">
                <HelpCircle className="w-5 h-5 text-primary" /> {question}
            </h4>
            <p className="text-slate-500 text-sm leading-relaxed pl-7">{answer}</p>
        </div>
    );
}
