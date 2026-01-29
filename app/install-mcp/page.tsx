'use client';

import { useState } from 'react';
import { Brain, Copy, CheckCircle, Terminal, Globe, Key, Shield, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
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
        <div className="min-h-screen bg-[#f0f0f0] text-black font-sans selection:bg-[#FF5500] selection:text-white">
            {/* Grid Background */}
            <div className="fixed inset-0 bg-grid-pattern pointer-events-none -z-10" />

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-[#f0f0f0]/90 backdrop-blur-sm border-b border-black h-16 flex items-center justify-between px-6">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-[#FF5500] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Brain className="text-white w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold font-heading tracking-wide">LOOPMEMORY</span>
                </Link>
                <Link
                    href="/dashboard"
                    className="px-6 py-2 bg-black text-white hover:bg-[#FF5500] transition-colors font-mono text-xs uppercase tracking-widest"
                >
                    Launch Dashboard
                </Link>
            </nav>

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
                {/* Header */}
                <div className="mb-16 border-l-4 border-[#FF5500] pl-6 bg-white p-8 border border-black shadow-[8px_8px_0px_rgba(0,0,0,1)]">
                    <h1 className="text-5xl font-black font-heading uppercase mb-4">
                        Install MCP Node
                    </h1>
                    <p className="text-lg font-mono text-[#666]">
                        Connect LoopMemory to your local AI environment.
                    </p>
                </div>

                {/* Steps Container */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Step 1: Select Client */}
                    <div className="lg:col-span-12 industrial-card border border-black bg-white p-8">
                        <div className="flex items-center gap-4 mb-8">
                            <span className="font-mono text-4xl text-[#FF5500] font-bold">01</span>
                            <h2 className="text-2xl font-bold font-heading uppercase">Select Environment</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {clients.map((client) => (
                                <button
                                    key={client.id}
                                    onClick={() => setSelectedClient(client.id)}
                                    className={`p-6 border-2 text-left transition-all ${selectedClient === client.id
                                            ? 'border-[#FF5500] bg-[#fff0e6] shadow-[4px_4px_0px_#FF5500] translate-x-[-2px] translate-y-[-2px]'
                                            : 'border-black hover:border-[#FF5500]'
                                        }`}
                                >
                                    <div className="text-3xl mb-3">{client.icon}</div>
                                    <h3 className="font-bold font-heading uppercase text-lg mb-1">{client.name}</h3>
                                    <p className="font-mono text-xs text-[#666]">{client.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Step 2: Generate Token */}
                    <div className="lg:col-span-12 industrial-card border border-black bg-white p-8">
                        <div className="flex items-center gap-4 mb-8">
                            <span className="font-mono text-4xl text-[#FF5500] font-bold">02</span>
                            <h2 className="text-2xl font-bold font-heading uppercase">Generate Secure Key</h2>
                        </div>

                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="flex-1">
                                <p className="mb-6 font-mono text-sm text-[#444] border-l-2 border-black pl-4">
                                    This token authorizes your local CLI to communicate with the LoopMemory Memory Graph without requiring a browser login flow.
                                </p>
                                {!generatedToken ? (
                                    <button
                                        onClick={handleGenerateToken}
                                        disabled={loadingToken}
                                        className="px-8 py-4 bg-black text-white hover:bg-[#FF5500] hover:text-white transition-all font-bold uppercase tracking-wide flex items-center gap-3 active:translate-y-1"
                                    >
                                        {loadingToken ? <Loader2 className="w-5 h-5 animate-spin" /> : <Key className="w-5 h-5" />}
                                        Generate Token
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2 text-green-600 font-bold border border-green-600 bg-green-50 px-4 py-2 inline-block">
                                        <CheckCircle className="w-5 h-5" />
                                        TOKEN READY
                                    </div>
                                )}
                            </div>

                            {generatedToken && (
                                <div className="flex-1 w-full animate-in fade-in slide-in-from-right-4">
                                    <label className="block font-mono text-xs uppercase mb-2 text-[#666]">Access Token</label>
                                    <div className="flex items-stretch border border-black">
                                        <input
                                            type="text"
                                            readOnly
                                            value={generatedToken}
                                            className="flex-1 p-4 font-mono text-sm bg-[#f5f5f5] outline-none"
                                        />
                                        <button
                                            onClick={handleCopyToken}
                                            className="px-6 bg-black text-white hover:bg-[#FF5500] transition-colors"
                                        >
                                            {copiedToken ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Step 3: Run Command */}
                    <div className={`lg:col-span-12 industrial-card border border-black bg-white p-8 transition-all ${generatedToken ? '' : 'opacity-50 grayscale pointer-events-none'}`}>
                        <div className="flex items-center gap-4 mb-8">
                            <span className="font-mono text-4xl text-[#FF5500] font-bold">03</span>
                            <h2 className="text-2xl font-bold font-heading uppercase">Execute Injection</h2>
                        </div>

                        <div className="bg-black p-6 relative group overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={handleCopyCommand}
                                    className="text-white hover:text-[#FF5500]"
                                >
                                    {copiedCommand ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>
                            <code className="font-mono text-sm text-[#00ff00] break-all block">
                                {getCommand()}
                            </code>
                        </div>
                        <div className="mt-4 flex gap-2 text-sm font-mono text-[#666]">
                            <Terminal className="w-4 h-4" />
                            <span>Run in your local terminal window. Requires Node.js.</span>
                        </div>
                    </div>

                    {/* Verification & Help */}
                    <div className="lg:col-span-12 grid md:grid-cols-2 gap-8">
                        <div className="border border-black bg-white p-8">
                            <h3 className="font-bold font-heading uppercase text-xl mb-4 flex items-center gap-2">
                                <Shield className="w-5 h-5" /> Verification
                            </h3>
                            <ul className="space-y-3 font-mono text-sm">
                                <li className="flex gap-2 items-start">
                                    <span className="text-[#FF5500]">➜</span> Open {clients.find(c => c.id === selectedClient)?.name}
                                </li>
                                <li className="flex gap-2 items-start">
                                    <span className="text-[#FF5500]">➜</span> Check for "loopmemory" toolset
                                </li>
                                <li className="flex gap-2 items-start">
                                    <span className="text-[#FF5500]">➜</span> Prompt: "Save a memory: I like orange."
                                </li>
                            </ul>
                        </div>

                        <div className="border border-black bg-white p-8">
                            <h3 className="font-bold font-heading uppercase text-xl mb-4 flex items-center gap-2">
                                <Globe className="w-5 h-5" /> Available Tools
                            </h3>
                            <div className="grid grid-cols-2 gap-4 font-mono text-sm">
                                <div className="bg-[#f5f5f5] p-2 border border-[#ddd]">addMemory</div>
                                <div className="bg-[#f5f5f5] p-2 border border-[#ddd]">searchMemories</div>
                                <div className="bg-[#f5f5f5] p-2 border border-[#ddd]">getProjects</div>
                                <div className="bg-[#f5f5f5] p-2 border border-[#ddd]">whoAmI</div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
