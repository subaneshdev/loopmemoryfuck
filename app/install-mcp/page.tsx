'use client';

import { useState } from 'react';
import { Brain, Copy, CheckCircle, Terminal, Globe, Key, Shield, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function InstallMCPPage() {
    const [selectedClient, setSelectedClient] = useState<string>('claude');

    const [generatedToken, setGeneratedToken] = useState<string>('');
    const [loadingToken, setLoadingToken] = useState(false);
    const [copiedToken, setCopiedToken] = useState(false);
    const [copiedCommand, setCopiedCommand] = useState(false);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://loopmemory.vercel.app';

    const getCommand = () => {
        const tokenPart = generatedToken ? generatedToken : '<PASTE_TOKEN_HERE>';

        // Use query parameter for token to avoid shell quoting issues on Windows
        // This is safer and works on all platforms
        return `npx -y install-mcp@latest "${appUrl}/api/mcp?token=${tokenPart}" --client ${selectedClient} --oauth=no`;
    };

    const handleCopyToken = () => {
        navigator.clipboard.writeText(generatedToken);
        setCopiedToken(true);
        setTimeout(() => setCopiedToken(false), 2000);
    };

    const handleCopyCommand = () => {
        navigator.clipboard.writeText(getCommand());
        setCopiedCommand(true);
        setTimeout(() => setCopiedCommand(false), 2000);
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
                        <Terminal className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                        <h1 className="text-4xl font-bold gradient-text">Install LoopMemory MCP</h1>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Follow these 3 steps to connect LoopMemory to your AI assistant.
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

                    {/* Step 2: Generate Token */}
                    <div className="glass rounded-2xl p-8 animate-in fade-in slide-in-from-bottom-4 delay-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                            <h2 className="text-xl font-bold">Generate Access Token</h2>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-xl p-6">
                            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-1">Create a Secure Connection Key</h3>
                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                        This token allows the CLI to authenticate without opening a browser.
                                    </p>
                                </div>
                                {!generatedToken ? (
                                    <button
                                        onClick={handleGenerateToken}
                                        disabled={loadingToken}
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/20"
                                    >
                                        {loadingToken ? <Loader2 className="w-5 h-5 animate-spin" /> : <Key className="w-5 h-5" />}
                                        Generate Token
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg border border-green-200 dark:border-green-800">
                                        <CheckCircle className="w-5 h-5" />
                                        Token Generated Successfully
                                    </div>
                                )}
                            </div>

                            {generatedToken && (
                                <div className="mt-6 animate-in fade-in slide-in-from-top-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Your Access Token
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            readOnly
                                            value={generatedToken}
                                            className="w-full pl-4 pr-12 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-mono text-sm text-gray-600 dark:text-gray-400 focus:outline-none"
                                        />
                                        <button
                                            onClick={handleCopyToken}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-500"
                                            title="Copy Token"
                                        >
                                            {copiedToken ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Step 3: Run Command */}
                    <div className={`glass rounded-2xl p-8 transition-all duration-500 ${generatedToken ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 grayscale'}`}>
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
                                        onClick={handleCopyCommand}
                                        disabled={!generatedToken}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white disabled:opacity-50"
                                        title="Copy Command"
                                    >
                                        {copiedCommand ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                            <Terminal className="w-5 h-5 mt-0.5" />
                            <p>
                                Copy and run this command in your terminal. It will automatically use the token you generated above.
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
