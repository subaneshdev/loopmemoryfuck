'use client';

import { useState, useEffect } from 'react';
import { Brain, Plus, Search as SearchIcon, Loader2, LogOut, Trash2, ChevronDown, Sparkles, Command, History, Settings, ArrowUp } from 'lucide-react';
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
    const [deletingId, setDeletingId] = useState<string | null>(null);

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

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this memory?')) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/memories/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setMemories(memories.filter(m => m.id !== id));
            } else {
                alert('Failed to delete memory');
            }
        } catch (e) {
            alert('Error deleting memory');
        } finally {
            setDeletingId(null);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        router.push('/login');
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-white" />
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white selection:bg-white/20">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Brain className="w-6 h-6 text-white" />
                        <span className="text-lg font-bold tracking-tight">LoopMemory</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white text-black text-sm font-medium rounded-full hover:bg-gray-200 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Memory
                        </button>
                        <div className="flex items-center gap-4">
                            <History className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                            <Settings className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                            <Link href="/install-mcp" className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold hover:bg-blue-500 transition-colors">
                                S
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
                {/* Hero / Chat Interface */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">
                        Welcome, <span className="text-blue-500">{user?.email?.split('@')[0]}</span>
                    </h1>

                    <div className="relative max-w-3xl mx-auto group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                        <div className="relative bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
                            <textarea
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSearch())}
                                placeholder="Ask LoopMemory..."
                                className="w-full bg-transparent border-none text-lg text-white placeholder-gray-500 focus:ring-0 resize-none min-h-[60px] mb-4"
                            />

                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="flex items-center gap-2">
                                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-400 hover:text-white transition-colors border border-white/5">
                                        <Command className="w-3 h-3" />
                                        Default Project
                                        <ChevronDown className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-400 hover:text-white transition-colors border border-white/5">
                                        <Sparkles className="w-3 h-3" />
                                        Gemini 2.5 Pro
                                        <ChevronDown className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={handleSearch}
                                        disabled={loading}
                                        className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUp className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Memory Modal */}
                {showAddForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
                            <h2 className="text-xl font-bold mb-4">Add New Memory</h2>
                            <textarea
                                placeholder="What would you like to remember?"
                                value={newMemory.text}
                                onChange={(e) => setNewMemory({ ...newMemory, text: e.target.value })}
                                className="w-full p-4 bg-black/50 border border-white/10 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none min-h-[150px] mb-6 text-white placeholder-gray-600"
                                autoFocus
                            />
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowAddForm(false)}
                                    className="px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddMemory}
                                    disabled={loading || !newMemory.text.trim()}
                                    className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : 'Save Memory'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Memories Grid */}
                <div className="space-y-6">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-8 animate-pulse">
                        <ChevronDown className="w-4 h-4" />
                        <span>Scroll down to see memories</span>
                        <ChevronDown className="w-4 h-4" />
                    </div>

                    {error && (
                        <div className="p-4 bg-red-900/20 text-red-400 border border-red-900/50 rounded-xl text-center">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {memories.map((memory) => (
                            <div key={memory.id} className="group relative bg-zinc-900/40 border border-white/5 hover:border-white/10 rounded-xl p-5 transition-all hover:bg-zinc-900/60">
                                <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-4 group-hover:text-gray-200">
                                    {memory.content}
                                </p>
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                                    <span className="text-xs text-gray-600 font-mono">
                                        {new Date(memory.created_at).toLocaleDateString()}
                                    </span>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleDelete(memory.id)}
                                            disabled={deletingId === memory.id}
                                            className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                                            title="Delete Memory"
                                        >
                                            {deletingId === memory.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
