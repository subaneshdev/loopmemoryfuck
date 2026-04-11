'use client';

import { useState, useEffect } from 'react';
import { Brain, Key, Plus, Trash2, Copy, Check, Loader2, BarChart3, Code2, ArrowLeft, Shield, Eye, EyeOff, Terminal, Zap } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/app/providers/auth-provider';
import { useRouter } from 'next/navigation';

interface ApiKey {
    id: string;
    name: string;
    key_prefix: string;
    scopes: string[];
    rate_limit: number;
    last_used_at: string | null;
    created_at: string;
}

export default function DeveloperPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [newKeyName, setNewKeyName] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'keys' | 'docs'>('keys');

    useEffect(() => {
        if (user && !authLoading) {
            fetchKeys();
        }
    }, [user, authLoading]);

    const fetchKeys = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/keys');
            const data = await res.json();
            if (data.success) {
                setKeys(data.keys || []);
            }
        } catch (e) {
            console.error('Failed to fetch keys:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateKey = async () => {
        if (!newKeyName.trim()) return;
        setCreating(true);
        try {
            const res = await fetch('/api/keys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newKeyName }),
            });
            const data = await res.json();
            if (data.success) {
                setNewlyCreatedKey(data.key);
                setShowCreateForm(false);
                setNewKeyName('');
                fetchKeys();
            }
        } catch (e) {
            console.error('Failed to create key:', e);
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteKey = async (id: string) => {
        if (!confirm('Are you sure? This will permanently revoke this key.')) return;
        setDeletingId(id);
        try {
            await fetch(`/api/keys/${id}`, { method: 'DELETE' });
            setKeys(keys.filter(k => k.id !== id));
        } catch (e) {
            console.error('Failed to delete key:', e);
        } finally {
            setDeletingId(null);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://loopmemory.vercel.app';

    return (
        <div className="min-h-screen bg-white text-slate-950">
            <div className="fixed inset-0 bg-grid-white pointer-events-none -z-10 opacity-60" />

            {/* Header */}
            <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Link>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <Brain className="text-white w-5 h-5" />
                            </div>
                            <span className="text-lg font-bold font-heading tracking-tight">Developer Console</span>
                        </div>
                    </div>
                    <Link href="/docs" className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors">
                        API Docs
                    </Link>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-12">
                {/* Tabs */}
                <div className="flex gap-1 mb-10 bg-slate-100 p-1 rounded-xl w-fit">
                    <button
                        onClick={() => setActiveTab('keys')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'keys' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <span className="flex items-center gap-2"><Key className="w-4 h-4" /> API Keys</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('docs')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'docs' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <span className="flex items-center gap-2"><Code2 className="w-4 h-4" /> Quick Start</span>
                    </button>
                </div>

                {activeTab === 'keys' && (
                    <div className="space-y-8">
                        {/* Newly Created Key Banner */}
                        {newlyCreatedKey && (
                            <div className="p-6 bg-green-50 border border-green-200 rounded-2xl">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-bold text-green-900 flex items-center gap-2">
                                            <Check className="w-5 h-5" /> API Key Created
                                        </h3>
                                        <p className="text-green-700 text-sm mt-1">Copy this key now. It will not be shown again.</p>
                                    </div>
                                    <button onClick={() => setNewlyCreatedKey(null)} className="text-green-600 hover:text-green-800 text-sm font-medium">
                                        Dismiss
                                    </button>
                                </div>
                                <div className="flex items-center gap-3 bg-white border border-green-200 rounded-xl p-4 font-mono text-sm">
                                    <code className="flex-1 break-all text-green-800">{newlyCreatedKey}</code>
                                    <button
                                        onClick={() => copyToClipboard(newlyCreatedKey)}
                                        className="p-2 hover:bg-green-100 rounded-lg transition-colors shrink-0"
                                    >
                                        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-green-600" />}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold font-heading">Your API Keys</h2>
                                <p className="text-slate-500 text-sm mt-1">Manage keys for the LoopMemory REST API</p>
                            </div>
                            <button
                                onClick={() => setShowCreateForm(true)}
                                className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 shadow-md shadow-blue-500/10"
                            >
                                <Plus className="w-4 h-4" /> New Key
                            </button>
                        </div>

                        {/* Create Form */}
                        {showCreateForm && (
                            <div className="premium-card p-6">
                                <h3 className="font-bold mb-4">Create New API Key</h3>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={newKeyName}
                                        onChange={(e) => setNewKeyName(e.target.value)}
                                        placeholder="Key name (e.g., Production, My App)"
                                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                        onKeyDown={(e) => e.key === 'Enter' && handleCreateKey()}
                                        autoFocus
                                    />
                                    <button
                                        onClick={handleCreateKey}
                                        disabled={creating || !newKeyName.trim()}
                                        className="px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
                                    >
                                        {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create'}
                                    </button>
                                    <button
                                        onClick={() => { setShowCreateForm(false); setNewKeyName(''); }}
                                        className="px-4 py-3 text-slate-500 hover:text-slate-700 text-sm font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Keys List */}
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                            </div>
                        ) : keys.length === 0 ? (
                            <div className="premium-card p-12 text-center">
                                <Key className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <h3 className="font-bold text-lg mb-2">No API Keys Yet</h3>
                                <p className="text-slate-500 text-sm mb-6">Create your first key to start using the LoopMemory API</p>
                                <button
                                    onClick={() => setShowCreateForm(true)}
                                    className="px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-blue-700"
                                >
                                    Create First Key
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {keys.map((key) => (
                                    <div key={key.id} className="premium-card p-5 flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-primary">
                                                <Key className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm">{key.name}</div>
                                                <div className="font-mono text-xs text-slate-500 mt-0.5">{key.key_prefix}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right hidden sm:block">
                                                <div className="text-xs text-slate-400">
                                                    {key.last_used_at ? `Last used ${new Date(key.last_used_at).toLocaleDateString()}` : 'Never used'}
                                                </div>
                                                <div className="text-xs text-slate-400 mt-0.5">
                                                    Created {new Date(key.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteKey(key.id)}
                                                disabled={deletingId === key.id}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                {deletingId === key.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'docs' && (
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold font-heading">Quick Start</h2>
                            <p className="text-slate-500 text-sm mt-1">Start using LoopMemory in under 2 minutes</p>
                        </div>

                        {/* Step 1 */}
                        <div className="premium-card p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                                <h3 className="font-bold">Get your API key</h3>
                            </div>
                            <p className="text-slate-500 text-sm mb-4 pl-11">Go to the API Keys tab and generate a new key.</p>
                        </div>

                        {/* Step 2: Store a memory */}
                        <div className="premium-card p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                                <h3 className="font-bold">Store a memory</h3>
                            </div>
                            <div className="bg-slate-900 rounded-xl p-5 font-mono text-sm text-slate-300 overflow-x-auto ml-11">
                                <div className="text-blue-400">// cURL</div>
                                <pre className="whitespace-pre-wrap mt-2">{`curl -X POST ${BASE_URL}/api/v1/memories \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: lm_sk_your_key_here" \\
  -d '{"text": "The user prefers dark mode"}'`}</pre>
                            </div>
                        </div>

                        {/* Step 3: Search memories */}
                        <div className="premium-card p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                                <h3 className="font-bold">Search memories</h3>
                            </div>
                            <div className="bg-slate-900 rounded-xl p-5 font-mono text-sm text-slate-300 overflow-x-auto ml-11">
                                <div className="text-blue-400">// cURL</div>
                                <pre className="whitespace-pre-wrap mt-2">{`curl -X POST ${BASE_URL}/api/v1/memories/search \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: lm_sk_your_key_here" \\
  -d '{"query": "What theme does the user prefer?"}'`}</pre>
                            </div>
                        </div>

                        {/* JavaScript example */}
                        <div className="premium-card p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">JS</div>
                                <h3 className="font-bold">JavaScript / Node.js</h3>
                            </div>
                            <div className="bg-slate-900 rounded-xl p-5 font-mono text-sm text-slate-300 overflow-x-auto ml-11">
                                <pre className="whitespace-pre-wrap">{`const response = await fetch("${BASE_URL}/api/v1/memories", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": process.env.LOOPMEMORY_API_KEY
  },
  body: JSON.stringify({
    text: "User completed onboarding",
    tags: ["onboarding", "milestone"],
    projectId: "optional-project-id"
  })
});

const data = await response.json();
console.log(data.memory.id);`}</pre>
                            </div>
                        </div>

                        {/* Python example */}
                        <div className="premium-card p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">PY</div>
                                <h3 className="font-bold">Python</h3>
                            </div>
                            <div className="bg-slate-900 rounded-xl p-5 font-mono text-sm text-slate-300 overflow-x-auto ml-11">
                                <pre className="whitespace-pre-wrap">{`import requests

response = requests.post(
    "${BASE_URL}/api/v1/memories/search",
    headers={
        "Content-Type": "application/json",
        "X-API-Key": "lm_sk_your_key_here"
    },
    json={"query": "user preferences"}
)

results = response.json()["results"]
for r in results:
    print(f"[{r['score']:.2f}] {r['memory']['content']}")`}</pre>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
