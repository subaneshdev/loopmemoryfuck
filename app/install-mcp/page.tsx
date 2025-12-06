'use client';

import { useState } from 'react';
import { Brain, Copy, CheckCircle, Terminal, Globe, Key, Shield, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function InstallMCPPage() {
    const [selectedClient, setSelectedClient] = useState<string>('claude');
    const [authMethod, setAuthMethod] = useState<'browser' | 'manual'>('browser');
    const [generatedToken, setGeneratedToken] = useState<string>('');
    const [copied, setCopied] = useState(false);
    const [loadingToken, setLoadingToken] = useState(false);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://loopmemory.vercel.app';

    const getCommand = () => {
        const base = `npx -y install-mcp@latest ${appUrl}/api/mcp --client ${selectedClient}`;

        if (authMethod === 'manual' && generatedToken) {
            return `${base} --oauth=no --header "Authorization: Bearer ${generatedToken}"`;
        }

        return `${base} --oauth=yes`;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(getCommand());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleGenerateToken = async () => {
        setLoadingToken(true);
        try {
            const res = await fetch('/api/auth/token/generate', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                setGeneratedToken(data.token);
            } else {
                alert('Failed to generate token: ' + data.error);
            }
        } catch (e) {
            alert('Error generating token');
        } finally {
            setLoadingToken(false);
        }
    };

    const clients = [
        { id: 'claude', name: 'Claude Desktop', icon: '🤖', description: 'Anthropic Claude Desktop app' },
        { id: 'vscode', name: 'VS Code', icon: '💻', description: 'Visual Studio Code editor' },
        { id: 'cursor', name: 'Cursor', icon: '⚡', description: 'AI-first code editor' },
        { id: 'cline', name: 'Cline', icon: '🔧', description: 'AI coding assistant' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950">
            {/* Navigation */}
            <nav className="glass border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        <span className="text-2xl font-bold gradient-text">LoopMemory</span>
                    </Link>
                    <Link
                        href="/dashboard"
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium hover:shadow-lg transition-all"
                    >
                        Dashboard
                    </Link>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Globe className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                        <h1 className="text-4xl font-bold gradient-text">Install LoopMemory MCP</h1>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Connect your memories to Claude, VS Code, and more.
                    </p>
                </div>

                {/* Steps */}
                <div className="space-y-8">
                    {/* Step 1: Select Client */}
                    <div className="glass rounded-2xl p-8 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                            <h2 className="text-xl font-bold">Select Your AI Client</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {clients.map((client) => (
                                <button
                                    key={client.id}
                                    onClick={() => setSelectedClient(client.id)}
                                    className={`p-4 rounded-xl border-2 transition-all text-left ${selectedClient === client.id
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-2xl">{client.icon}</span>
                                        <h3 className="font-bold">{client.name}</h3>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{client.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Step 2: Auth Method */}
                    <div className="glass rounded-2xl p-8 animate-in fade-in slide-in-from-bottom-4 delay-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                            <h2 className="text-xl font-bold">Choose Authentication Method</h2>
                        </div>

                        <div className="flex gap-4 mb-6">
                            <button
                                onClick={() => setAuthMethod('browser')}
                                className={`flex-1 p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${authMethod === 'browser'
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                                    }`}
                            >
                                <Globe className="w-5 h-5" />
                                <span className="font-bold">Browser Login (Recommended)</span>
                            </button>
                            <button
                                onClick={() => setAuthMethod('manual')}
                                className={`flex-1 p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${authMethod === 'manual'
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                                    }`}
                            >
                                <Key className="w-5 h-5" />
                                <span className="font-bold">Manual Token (For Headless/SSH)</span>
                            </button>
                        </div>

                        {authMethod === 'manual' && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-yellow-800 dark:text-yellow-200">Generate a Token First</h4>
                                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                                            Since you cannot open a browser, you need to generate a secure token here.
                                        </p>
                                        {!generatedToken ? (
                                            <button
                                                onClick={handleGenerateToken}
                                                disabled={loadingToken}
                                                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium transition-colors"
                                            >
                                                {loadingToken ? 'Generating...' : 'Generate Token'}
                                            </button>
                                        ) : (
                                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
                                                <CheckCircle className="w-5 h-5" />
                                                Token Generated!
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Step 3: Run Command */}
                    <div className="glass rounded-2xl p-8 animate-in fade-in slide-in-from-bottom-4 delay-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                            <h2 className="text-xl font-bold">Run Installation Command</h2>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative bg-gray-900 rounded-xl p-6 font-mono text-sm text-gray-300 overflow-x-auto">
                                <div className="flex justify-between items-start gap-4">
                                    <code className="flex-1 whitespace-pre-wrap break-all">
                                        {getCommand()}
                                    </code>
                                    <button
                                        onClick={handleCopy}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                                        title="Copy to clipboard"
                                    >
                                        {copied ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                            <Terminal className="w-5 h-5 mt-0.5" />
                            <p>
                                Paste this command into your terminal.
                                {authMethod === 'browser'
                                    ? ' It will open your browser to authenticate.'
                                    : ' It will use the generated token instantly.'}
                            </p>
                        </div>
                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                            <p className="text-sm text-blue-800 dark:text-blue-300">
                                💡 <strong>Tip:</strong> Make sure you have Node.js installed on your system before running this command.
                            </p>
                        </div>
                    </div>

                    {/* Step 3: Verify Connection */}
                    <div className="glass rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                                3
                            </div>
                            <h2 className="text-2xl font-bold">Verify Connection</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">✓</div>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Open {clients.find(c => c.id === selectedClient)?.name}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">✓</div>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Look for "loopmemory" in the available tools
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">✓</div>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Try asking: "Add a memory: Remember that I prefer dark mode"
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">✓</div>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Search your memories: "Search my memories for preferences"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Available MCP Tools */}
                    <div className="glass rounded-2xl p-8">
                        <h2 className="text-2xl font-bold mb-6">Available MCP Tools</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-white/50 dark:bg-black/50 rounded-xl">
                                <h3 className="font-bold mb-2">🧠 addMemory</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Store a new memory with optional source, tags, and metadata
                                </p>
                            </div>
                            <div className="p-4 bg-white/50 dark:bg-black/50 rounded-xl">
                                <h3 className="font-bold mb-2">🔍 searchMemories</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Search memories using semantic similarity with customizable filters
                                </p>
                            </div>
                            <div className="p-4 bg-white/50 dark:bg-black/50 rounded-xl">
                                <h3 className="font-bold mb-2">👤 whoAmI</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Get information about the current user and their profile
                                </p>
                            </div>
                            <div className="p-4 bg-white/50 dark:bg-black/50 rounded-xl">
                                <h3 className="font-bold mb-2">📁 getProjects</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    List all projects and their associated memories
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <Link
                        href="/dashboard"
                        className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all"
                    >
                        Go to Dashboard
                    </Link>
                </div>
            </main>
        </div>
    );
}
