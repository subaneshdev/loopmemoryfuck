'use client';

import { useState, useEffect } from 'react';
import { Brain, Plus, Search as SearchIcon, Loader2, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/app/providers/auth-provider';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const { user, loading: authLoading, signOut } = useAuth();
    const router = useRouter();
    const [memories, setMemories] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newMemory, setNewMemory] = useState({ text: '', source: '' });
    const [error, setError] = useState('');

    // Fetch recent memories
    useEffect(() => {
        if (user && !authLoading) {
            fetchMemories();
        }
    }, [user, authLoading]);

    const fetchMemories = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/memories?limit=20');
            const data = await res.json();
            if (data.success) {
                setMemories(data.memories || []);
            } else {
                setError(data.error || 'Failed to fetch memories');
            }
        } catch (error) {
            console.error('Failed to fetch memories:', error);
            setError('Failed to fetch memories');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            fetchMemories();
            return;
        }

        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/memories/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: searchQuery, limit: 20 }),
            });
            const data = await res.json();
            if (data.success) {
                setMemories(data.results.map((r: any) => r.memory) || []);
            } else {
                setError(data.error || 'Search failed');
            }
        } catch (error) {
            console.error('Search failed:', error);
            setError('Search failed');
        } finally {
            setLoading(false);
        }
    };

    const handleAddMemory = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/memories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMemory),
            });
            const data = await res.json();
            if (data.success) {
                setNewMemory({ text: '', source: '' });
                setShowAddForm(false);
                fetchMemories();
            } else {
                setError(data.error || 'Failed to add memory');
            }
        } catch (error) {
            console.error('Failed to add memory:', error);
            setError('Failed to add memory');
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        router.push('/login');
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            </div>
        );
    }

    const handleGenerateToken = async () => {
        try {
            const res = await fetch('/api/auth/token/generate', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                // Copy to clipboard
                await navigator.clipboard.writeText(data.token);
                alert('Token copied to clipboard! Use it with --header "Authorization: Bearer <TOKEN>"');
            } else {
                alert('Failed to generate token: ' + data.error);
            }
        } catch (e) {
            alert('Error generating token');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950">
            {/* Header */}
            <header className="glass sticky top-0 z-50 border-b border-gray-200/50 dark:border-gray-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        <span className="text-xl font-bold gradient-text">LoopMemory</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleGenerateToken}
                            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        >
                            Generate CLI Token
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-800">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {user?.email}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    ID: {user?.id}
                                </p>
                            </div>
                            <button
                                onClick={() => signOut()}
                                className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                                title="Sign Out"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search & Add */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search memories semantically..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
                    </button>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Add Memory
                    </button>
                </div>

                {/* Add Memory Form */}
                {showAddForm && (
                    <div className="mb-8 glass rounded-2xl p-6 animate-in fade-in slide-in-from-top-4">
                        <textarea
                            placeholder="What would you like to remember?"
                            value={newMemory.text}
                            onChange={(e) => setNewMemory({ ...newMemory, text: e.target.value })}
                            className="w-full p-4 bg-white/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px] mb-4"
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddMemory}
                                disabled={loading || !newMemory.text.trim()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                Save Memory
                            </button>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800">
                        {error}
                    </div>
                )}

                {/* Memories Grid */}

                {memories.map((memory) => (
                    <div key={memory.id} className="glass rounded-2xl p-6 hover:shadow-xl transition-all group">
                        <p className="text-gray-800 dark:text-gray-200 mb-4 line-clamp-4">
                            {memory.content}
                        </p>
                        {memory.source && (
                            <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm mb-2">
                                {memory.source}
                            </span>
                        )}
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(memory.created_at).toLocaleDateString()}
                        </div>
                    </div>
                ))}
        </div>
            </main >
        </div >
    );
}
