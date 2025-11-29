'use client';

import { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Brain, Loader2, Check } from 'lucide-react';
import { signIn } from '@/lib/supabase-auth';

function OAuthAuthorizeContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUri = searchParams.get('redirect_uri');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!redirectUri) {
            setError('Missing redirect_uri parameter');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Authenticate user with Supabase
            const { user } = await signIn(email, password);

            if (!user) {
                throw new Error('Authentication failed');
            }

            // Exchange credentials for authorization code
            const response = await fetch('/api/auth/oauth/authorize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user.id,
                    email: user.email,
                    redirect_uri: redirectUri,
                }),
            });
            const data = await response.json();

            if (data.success && data.code) {
                // Redirect to callback with authorization code
                const callbackUrl = new URL(redirectUri);
                callbackUrl.searchParams.set('code', data.code);
                window.location.href = callbackUrl.toString();
            } else {
                setError(data.error || 'Authorization failed');
                setLoading(false);
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
            setLoading(false);
        }
    };

    if (!redirectUri) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950">
                <div className="glass rounded-2xl p-8 max-w-md">
                    <p className="text-red-600 dark:text-red-400">
                        Error: Missing redirect_uri parameter
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950 px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-2">
                        <Brain className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                        <span className="text-3xl font-bold gradient-text">LoopMemory</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Authorize MCP Access
                    </p>
                </div>

                {/* Authorization Info */}
                <div className="glass rounded-2xl p-6 mb-6">
                    <div className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold mb-1">MCP Server Authorization</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                An application is requesting access to your LoopMemory account.
                                Sign in to authorize.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Login Form */}
                <div className="glass rounded-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-white/50 dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="email@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-white/50 dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Authorizing...
                                </>
                            ) : (
                                'Authorize Access'
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                        Don't have an account?{' '}
                        <a href="/signup" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function OAuthAuthorizePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            </div>
        }>
            <OAuthAuthorizeContent />
        </Suspense>
    );
}
