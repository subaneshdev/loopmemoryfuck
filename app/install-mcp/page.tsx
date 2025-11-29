'use client';

import { useState } from 'react';
import { Brain, Copy, CheckCircle, Terminal, Globe } from 'lucide-react';
import Link from 'next/link';

export default function InstallMCPPage() {
    const [selectedClient, setSelectedClient] = useState<string>('claude');
    const [copied, setCopied] = useState(false);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://loopmemory.vercel.app';

    const installCommands: Record<string, string> = {
        claude: `npx -y mcp-remote@latest ${appUrl}/api/mcp`,
        vscode: `npx -y mcp-remote@latest ${appUrl}/api/mcp`,
        cursor: `npx -y mcp-remote@latest ${appUrl}/api/mcp`,
        cline: `npx -y mcp-remote@latest ${appUrl}/api/mcp`,
    };

    const handleCopy = () => {
        const command = installCommands[selectedClient];
        navigator.clipboard.writeText(command);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
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
            <nav className="glass border-b border-white/10">
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
            <main className="max-w-5xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <Globe className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                        <h1 className="text-5xl font-bold gradient-text">Install MCP</h1>
                    </div>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Connect LoopMemory to your favorite AI assistant through the Model Context Protocol
                    </p>
                </div>

                {/* Steps */}
                <div className="space-y-8">
                    {/* Step 1: Select Client */}
                    <div className="glass rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                                1
                            </div>
                            <h2 className="text-2xl font-bold">Select Your AI Client</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {clients.map((client) => (
                                <button
                                    key={client.id}
                                    onClick={() => setSelectedClient(client.id)}
                                    className={`p-6 rounded-xl border-2 transition-all text-left ${selectedClient === client.id
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-3xl">{client.icon}</span>
                                        <h3 className="text-lg font-bold">{client.name}</h3>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{client.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Step 2: Run Installation Command */}
                    <div className="glass rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                                2
                            </div>
                            <h2 className="text-2xl font-bold">Run Installation Command</h2>
                        </div>

                        <div className="bg-gray-900 rounded-xl p-6 relative">
                            <div className="flex items-center gap-2 mb-3">
                                <Terminal className="w-5 h-5 text-green-400" />
                                <span className="text-sm text-green-400 font-mono">Terminal</span>
                            </div>
                            <code className="text-green-400 font-mono text-sm block overflow-x-auto">
                                {installCommands[selectedClient]}
                            </code>
                            <button
                                onClick={handleCopy}
                                className="absolute top-6 right-6 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all flex items-center gap-2"
                            >
                                {copied ? (
                                    <>
                                        <CheckCircle className="w-4 h-4" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        Copy
                                    </>
                                )}
                            </button>
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
