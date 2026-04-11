import Link from 'next/link';
import { Brain, Key, Search, Database, FolderOpen, Zap, Shield, ArrowRight, Terminal, Code2 } from 'lucide-react';

export const metadata = {
    title: 'API Documentation',
    description: 'LoopMemory REST API documentation for developers. Store, search, and manage AI context programmatically.',
};

export default function DocsPage() {
    const BASE_URL = 'https://loopmemory.vercel.app';

    return (
        <div className="min-h-screen bg-white text-slate-950">
            <div className="fixed inset-0 bg-grid-white pointer-events-none -z-10 opacity-60" />

            {/* Nav */}
            <nav className="glass border-b border-slate-200/60 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Brain className="text-white w-5 h-5" />
                        </div>
                        <span className="text-lg font-bold font-heading tracking-tight">LoopMemory</span>
                        <span className="text-slate-400 text-sm font-medium ml-2">/ Docs</span>
                    </Link>
                    <Link href="/developer" className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition-all">
                        Get API Key
                    </Link>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-6 py-16">
                {/* Hero */}
                <div className="mb-20">
                    <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6 tracking-tight">API Reference</h1>
                    <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
                        Give your AI agents persistent long-term memory. The LoopMemory REST API lets you store, search, and manage context programmatically.
                    </p>
                </div>

                {/* Authentication */}
                <section className="mb-16" id="authentication">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-primary">
                            <Key className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl font-bold font-heading">Authentication</h2>
                    </div>
                    <div className="premium-card p-6 mb-4">
                        <p className="text-slate-600 mb-4">
                            All API requests require an <code className="bg-slate-100 px-2 py-0.5 rounded text-sm font-mono text-primary">X-API-Key</code> header.
                            Generate keys from the <Link href="/developer" className="text-primary hover:underline font-medium">Developer Console</Link>.
                        </p>
                        <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm text-slate-300">
                            <span className="text-blue-400">X-API-Key:</span> lm_sk_your_api_key_here
                        </div>
                    </div>
                    <div className="premium-card p-6">
                        <h4 className="font-bold text-sm mb-3 flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Rate Limiting</h4>
                        <p className="text-slate-500 text-sm">
                            Default: <strong>100 requests/minute</strong> per key. Rate limit headers are included in every response:
                        </p>
                        <ul className="mt-3 space-y-1 font-mono text-xs text-slate-500">
                            <li><code>X-RateLimit-Limit</code> — Max requests per window</li>
                            <li><code>X-RateLimit-Remaining</code> — Remaining requests</li>
                            <li><code>X-RateLimit-Reset</code> — Window reset timestamp (Unix)</li>
                        </ul>
                    </div>
                </section>

                {/* Endpoints */}
                <section className="space-y-12">
                    {/* POST /memories */}
                    <EndpointSection
                        method="POST"
                        path="/api/v1/memories"
                        description="Store a new memory with automatic semantic embedding and knowledge graph extraction."
                        baseUrl={BASE_URL}
                        requestBody={`{
  "text": "The user prefers dark mode and uses VS Code",
  "source": "onboarding",
  "projectId": "optional-uuid",
  "tags": ["preferences", "setup"],
  "metadata": { "priority": "high" }
}`}
                        responseBody={`{
  "success": true,
  "memory": {
    "id": "uuid",
    "content": "The user prefers dark mode and uses VS Code",
    "source": "onboarding",
    "project_id": null,
    "created_at": "2024-01-01T00:00:00Z"
  }
}`}
                        curlExample={`curl -X POST ${BASE_URL}/api/v1/memories \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: lm_sk_your_key" \\
  -d '{"text": "User prefers dark mode"}'`}
                    />

                    {/* GET /memories */}
                    <EndpointSection
                        method="GET"
                        path="/api/v1/memories"
                        description="List all stored memories, optionally filtered by project."
                        baseUrl={BASE_URL}
                        params={[
                            { name: 'projectId', type: 'string', desc: 'Filter by project UUID' },
                            { name: 'limit', type: 'number', desc: 'Max results (default: 50)' },
                            { name: 'offset', type: 'number', desc: 'Pagination offset (default: 0)' },
                        ]}
                        responseBody={`{
  "success": true,
  "memories": [...],
  "count": 20
}`}
                        curlExample={`curl ${BASE_URL}/api/v1/memories?limit=10 \\
  -H "X-API-Key: lm_sk_your_key"`}
                    />

                    {/* POST /memories/search */}
                    <EndpointSection
                        method="POST"
                        path="/api/v1/memories/search"
                        description="Semantic search across all memories using vector similarity. Returns results enriched with knowledge graph context."
                        baseUrl={BASE_URL}
                        requestBody={`{
  "query": "What editor does the user use?",
  "projectId": "optional-uuid",
  "limit": 5,
  "minScore": 0.5
}`}
                        responseBody={`{
  "success": true,
  "results": [
    {
      "memory": {
        "id": "uuid",
        "content": "The user prefers dark mode and uses VS Code",
        "graph_context": [
          { "name": "VS Code", "type": "TOOL", "relation": "MENTIONS" }
        ]
      },
      "score": 0.92
    }
  ],
  "count": 1
}`}
                        curlExample={`curl -X POST ${BASE_URL}/api/v1/memories/search \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: lm_sk_your_key" \\
  -d '{"query": "user editor preference"}'`}
                    />

                    {/* GET /projects */}
                    <EndpointSection
                        method="GET"
                        path="/api/v1/projects"
                        description="List all projects for the authenticated user."
                        baseUrl={BASE_URL}
                        responseBody={`{
  "success": true,
  "projects": [
    { "id": "uuid", "name": "My App", "description": "..." }
  ]
}`}
                        curlExample={`curl ${BASE_URL}/api/v1/projects \\
  -H "X-API-Key: lm_sk_your_key"`}
                    />

                    {/* POST /projects */}
                    <EndpointSection
                        method="POST"
                        path="/api/v1/projects"
                        description="Create a new project to organize memories."
                        baseUrl={BASE_URL}
                        requestBody={`{
  "name": "My Chatbot",
  "description": "Memory layer for my production chatbot"
}`}
                        responseBody={`{
  "success": true,
  "project": {
    "id": "uuid",
    "name": "My Chatbot",
    "description": "Memory layer for my production chatbot"
  }
}`}
                        curlExample={`curl -X POST ${BASE_URL}/api/v1/projects \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: lm_sk_your_key" \\
  -d '{"name": "My Chatbot"}'`}
                    />
                </section>

                {/* CTA */}
                <section className="mt-24 text-center">
                    <div className="premium-card p-12 bg-slate-50">
                        <h2 className="text-3xl font-bold font-heading mb-4">Ready to build?</h2>
                        <p className="text-slate-500 mb-8 max-w-md mx-auto">Generate your API key and start giving your AI agents persistent memory in minutes.</p>
                        <Link href="/developer" className="px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-blue-700 transition-all inline-flex items-center gap-2">
                            Get Your API Key <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}

// --- Endpoint Section Component ---
function EndpointSection({
    method,
    path,
    description,
    baseUrl,
    requestBody,
    responseBody,
    curlExample,
    params,
}: {
    method: string;
    path: string;
    description: string;
    baseUrl: string;
    requestBody?: string;
    responseBody: string;
    curlExample: string;
    params?: { name: string; type: string; desc: string }[];
}) {
    const methodColor = method === 'GET' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700';

    return (
        <div className="premium-card p-0 overflow-hidden" id={`${method.toLowerCase()}-${path.replace(/\//g, '-')}`}>
            <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${methodColor}`}>{method}</span>
                    <code className="font-mono text-sm font-bold">{path}</code>
                </div>
                <p className="text-slate-500 text-sm">{description}</p>
            </div>

            {params && (
                <div className="p-6 border-b border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Query Parameters</h4>
                    <div className="space-y-2">
                        {params.map((p) => (
                            <div key={p.name} className="flex gap-4 text-sm">
                                <code className="font-mono text-primary font-bold w-24 shrink-0">{p.name}</code>
                                <span className="text-slate-400 w-16 shrink-0">{p.type}</span>
                                <span className="text-slate-600">{p.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {requestBody && (
                <div className="p-6 border-b border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Request Body</h4>
                    <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-slate-300 overflow-x-auto">
                        <pre>{requestBody}</pre>
                    </div>
                </div>
            )}

            <div className="p-6 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Response</h4>
                <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-slate-300 overflow-x-auto">
                    <pre>{responseBody}</pre>
                </div>
            </div>

            <div className="p-6 bg-slate-50">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1"><Terminal className="w-3 h-3" /> cURL</h4>
                <div className="bg-slate-900 rounded-xl p-4 font-mono text-xs text-slate-300 overflow-x-auto">
                    <pre className="whitespace-pre-wrap">{curlExample}</pre>
                </div>
            </div>
        </div>
    );
}
