import Link from 'next/link';
import { Brain, Search, Zap, Database, Globe, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-blue-950 dark:to-purple-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold gradient-text">LoopMemory</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/install-mcp"
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Install MCP
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
              <span className="gradient-text">Universal Memory</span>
              <br />
              <span className="text-gray-800 dark:text-gray-100">for AI Assistants</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
              Store, search, and retrieve memories across all your AI platforms.
              Powered by semantic search and the Model Context Protocol.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Start Free
              </Link>
              <Link
                href="/install-mcp"
                className="px-8 py-4 glass text-gray-800 dark:text-gray-200 text-lg font-semibold rounded-full hover:shadow-xl transition-all flex items-center gap-2"
              >
                <Globe className="w-5 h-5" />
                Install MCP
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="glass rounded-2xl p-6 animate-fade-in">
              <div className="text-4xl font-bold gradient-text mb-2">∞</div>
              <div className="text-gray-600 dark:text-gray-400">Unlimited Memories</div>
            </div>
            <div className="glass rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl font-bold gradient-text mb-2">&lt;500ms</div>
              <div className="text-gray-600 dark:text-gray-400">Search Latency</div>
            </div>
            <div className="glass rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl font-bold gradient-text mb-2">4+</div>
              <div className="text-gray-600 dark:text-gray-400">AI Platforms</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="gradient-text">Powerful Features</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass rounded-2xl p-8 hover:shadow-2xl transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">AI-Powered Search</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Semantic search using Google Gemini embeddings finds exactly what you need, even with fuzzy queries.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass rounded-2xl p-8 hover:shadow-2xl transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">MCP Integration</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Connect with Claude Desktop, VSCode, Cursor, and Cline through the Model Context Protocol.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass rounded-2xl p-8 hover:shadow-2xl transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Database className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Vector Storage</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Pinecone-powered vector database ensures lightning-fast similarity search at scale.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass rounded-2xl p-8 hover:shadow-2xl transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Search className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Smart Organization</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Organize memories into projects with tags, metadata, and automatic categorization.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="glass rounded-2xl p-8 hover:shadow-2xl transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Real-Time Sync</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Memories sync instantly across all your devices and AI assistants.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="glass rounded-2xl p-8 hover:shadow-2xl transition-all group">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-green-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Secure & Private</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Your memories are encrypted and stored securely with row-level security.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center glass rounded-3xl p-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Ready to Get Started?</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Build your universal memory layer in minutes
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all"
          >
            Start Building Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto text-center text-gray-600 dark:text-gray-400">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="w-6 h-6" />
            <span className="font-semibold">LoopMemory</span>
          </div>
          <p className="text-sm">
            Built with Next.js, Supabase, Pinecone, and Google Gemini
          </p>
        </div>
      </footer>
    </div>
  );
}

