import Link from 'next/link';
import { Brain, Check, HelpCircle, X, ChevronRight } from 'lucide-react';

export const metadata = {
    title: 'Pricing | LoopMemory',
    description: 'Predictable, developer-friendly pricing for LoopMemory.',
};

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-white text-slate-950 flex flex-col relative overflow-hidden">
            {/* Background Elements */}
            <div className="fixed inset-0 bg-grid-white pointer-events-none z-0 opacity-60" />
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-100/40 blur-[120px] pointer-events-none -z-10" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-slate-100/50 blur-[100px] pointer-events-none -z-10" />

            {/* Navigation (simplified) */}
            <nav className="glass border-b border-slate-200/60 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Brain className="text-white w-5 h-5" />
                        </div>
                        <span className="text-lg font-bold font-heading tracking-tight">LoopMemory</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/docs" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Docs</Link>
                        <Link href="/developer" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Console</Link>
                        <Link href="/login" className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-full hover:bg-slate-800 transition-colors">
                            Sign In
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="flex-1 max-w-6xl mx-auto px-6 py-24 w-full z-10">
                {/* Hero */}
                <div className="max-w-3xl mx-auto text-center mb-20 animate-fade-in-up">
                    <h1 className="text-5xl md:text-6xl font-bold font-heading tracking-tight text-slate-900 mb-6">
                        Pricing that scales with your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">agents.</span>
                    </h1>
                    <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
                        Start for free, then transparently upgrade as your AI agents demand more context and higher throughput.
                    </p>

                    {/* Toggle */}
                    <div className="mt-10 flex items-center justify-center gap-3">
                        <span className="text-sm font-bold text-slate-900">Monthly</span>
                        <div className="w-12 h-6 bg-blue-100 rounded-full flex items-center p-1 cursor-pointer">
                            <div className="w-4 h-4 bg-primary rounded-full shadow-sm" />
                        </div>
                        <span className="text-sm font-bold text-slate-400">Annually <span className="ml-1 text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Save 20%</span></span>
                    </div>
                </div>

                {/* Pricing Grid */}
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-24">
                    {/* Starter Tier */}
                    <div className="premium-card p-8 flex flex-col relative bg-white border-slate-200 hover:-translate-y-1 transition-transform duration-300">
                        <h3 className="text-xl font-bold font-heading">Starter</h3>
                        <p className="text-slate-500 text-sm mt-2 mb-6">For hobbyists and side projects.</p>
                        <div className="mb-6">
                            <span className="text-4xl font-bold font-heading">$0</span>
                            <span className="text-slate-400">/mo</span>
                        </div>
                        <Link href="/signup" className="w-full py-3 bg-slate-100 text-slate-900 font-bold rounded-xl text-center hover:bg-slate-200 transition-colors mb-8">
                            Start for free
                        </Link>
                        <ul className="space-y-4 flex-1">
                            <FeatureItem icon={<Check className="text-green-500 w-5 h-5" />} text="10,000 requests / month" />
                            <FeatureItem icon={<Check className="text-green-500 w-5 h-5" />} text="100 requests / minute" />
                            <FeatureItem icon={<Check className="text-green-500 w-5 h-5" />} text="Standard Context Search" />
                            <FeatureItem icon={<X className="text-slate-300 w-5 h-5" />} text="Graph Extraction" />
                            <FeatureItem icon={<Check className="text-green-500 w-5 h-5" />} text="Community Discord Support" />
                        </ul>
                    </div>

                    {/* Pro Tier (Highlighted) */}
                    <div className="premium-card p-8 flex flex-col relative border-blue-500 shadow-2xl shadow-blue-500/20 transform scale-105 z-10 bg-white">
                        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold rounded-full uppercase tracking-widest shadow-lg">
                            Most Popular
                        </div>
                        <h3 className="text-xl font-bold font-heading text-blue-900">Pro API</h3>
                        <p className="text-slate-500 text-sm mt-2 mb-6">For production applications.</p>
                        <div className="mb-6">
                            <span className="text-4xl font-bold font-heading">$29</span>
                            <span className="text-slate-400">/mo</span>
                        </div>
                        <Link href="/signup" className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl text-center hover:opacity-90 transition-opacity mb-8 shadow-lg shadow-blue-500/25">
                            Get Pro
                        </Link>
                        <ul className="space-y-4 flex-1">
                            <FeatureItem icon={<Check className="text-blue-500 w-5 h-5" />} text="1,000,000 requests / month" />
                            <FeatureItem icon={<Check className="text-blue-500 w-5 h-5" />} text="500 requests / minute" />
                            <FeatureItem icon={<Check className="text-blue-500 w-5 h-5" />} text="Advanced Graph Extraction" />
                            <FeatureItem icon={<Check className="text-blue-500 w-5 h-5" />} text="Custom Namespaces" />
                            <FeatureItem icon={<Check className="text-blue-500 w-5 h-5" />} text="Priority Email Support" />
                        </ul>
                    </div>

                    {/* Enterprise Tier */}
                    <div className="premium-card p-8 flex flex-col relative bg-white border-slate-200 hover:-translate-y-1 transition-transform duration-300">
                        <h3 className="text-xl font-bold font-heading">Enterprise</h3>
                        <p className="text-slate-500 text-sm mt-2 mb-6">For scale and custom infrastructure.</p>
                        <div className="mb-6">
                            <span className="text-4xl font-bold font-heading">Custom</span>
                        </div>
                        <Link href="mailto:contact@loopmemory.ai" className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl text-center hover:bg-slate-800 transition-colors mb-8">
                            Contact Us
                        </Link>
                        <ul className="space-y-4 flex-1">
                            <FeatureItem icon={<Check className="text-slate-900 w-5 h-5" />} text="Custom request volumes" />
                            <FeatureItem icon={<Check className="text-slate-900 w-5 h-5" />} text="Unlimited rate limits" />
                            <FeatureItem icon={<Check className="text-slate-900 w-5 h-5" />} text="Dedicated Pinecone Env" />
                            <FeatureItem icon={<Check className="text-slate-900 w-5 h-5" />} text="Enterprise SLA" />
                            <FeatureItem icon={<Check className="text-slate-900 w-5 h-5" />} text="Dedicated Slack Channel" />
                        </ul>
                    </div>
                </div>

                {/* FAQ */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold font-heading text-center mb-10">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <FAQItem
                            question="How do you count a request?"
                            answer="A request is counted anytime you hit our /api/v1/memories or /api/v1/memories/search endpoints. Vector embeddings and graph extractions are included in this metric."
                        />
                        <FAQItem
                            question="What happens when I hit my rate limit?"
                            answer="Our API will return a 429 Status Code. We include headers indicating when your throttle window resets. For the Starter tier, this resets every minute."
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

function FeatureItem({ icon, text }: { icon: React.ReactNode, text: string }) {
    return (
        <li className="flex items-center gap-3">
            <div className="shrink-0">{icon}</div>
            <span className="text-slate-600 text-sm font-medium">{text}</span>
        </li>
    );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    return (
        <div className="premium-card p-6 cursor-pointer hover:bg-slate-50 transition-colors">
            <h4 className="font-bold flex items-center gap-2 mb-2">
                <HelpCircle className="w-5 h-5 text-primary" /> {question}
            </h4>
            <p className="text-slate-500 text-sm leading-relaxed pl-7">{answer}</p>
        </div>
    );
}
