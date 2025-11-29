'use client';

import { useState, useEffect } from 'react';
import { Brain, Plus, Search as SearchIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const [memories, setMemories] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newMemory, setNewMemory] = useState({ text: '', source: '' });

    // Fetch recent memories
    useEffect(() => {
        fetchMemories();
    }, []);

    const fetchMemories = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/memories?limit=20');
            const data = await res.json();
            if (data.success) {
                setMemories(data.memories || []);
            }
        } catch (error) {
            console.error('Failed to fetch memories:', error);
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
        try {
            const res = await fetch('/api/memories/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: searchQuery, limit: 20 }),
            });
            const data = await res.json();
            if (data.success) {
                setMemories(data.results.map((r: any) => r.memory) || []);
            }
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMemory = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
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
            }
        } catch (error) {
            console.error('Failed to add memory:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950">
            {/* Navigation */}
            <nav className="glass border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        <span className="text-2xl font-bold gradient-text">LoopMemory</span>
                    </Link>
                    <Link
                        href="/install-mcp"
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors"
                    >
                        Install MCP
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2 gradient-text">Your Memories</h1>
                    <p className="text-gray-600 dark:text-gray-400">Store and search your memories with AI-powered semantic search</p>
                </div>

                {/* Search Bar */}
                <div className="glass rounded-2xl p-6 mb-8">
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Search memories semantically..."
                                className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
                        </button>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="px-6 py-3 glass rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Add Memory
                        </button>
                    </div>
                </div>

                {/* Add Memory Form */}
                {showAddForm && (
                    <div className="glass rounded-2xl p-6 mb-8">
                        <h2 className="text-2xl font-bold mb-4">Add New Memory</h2>
                        <form onSubmit={handleAddMemory} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Memory Content *</label>
                                <textarea
                                    value={newMemory.text}
                                    onChange={(e) => setNewMemory({ ...newMemory, text: e.target.value })}
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 bg-white/50 dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your memory here..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Source (optional)</label>
                                <input
                                    type="text"
                                    value={newMemory.source}
                                    onChange={(e) => setNewMemory({ ...newMemory, source: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/50 dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Meeting notes, Article, etc."
                                />
                            </div>
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Memory'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="px-6 py-3 glass rounded-xl font-medium hover:shadow-lg transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Memories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {memories.length === 0 && !loading && (
                        <div className="col-span-full text-center py-20">
                            <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                {searchQuery ? 'No memories found' : 'No memories yet. Add your first memory!'}
                            </p>
                        </div>
                    )}

                    {loading && (
                        <div className="col-span-full text-center py-20">
                            <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-600" />
                        </div>
                    )}

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
            </main>
        </div>
    );
}
