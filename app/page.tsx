import Link from "next/link";
import { Brain, Search, Zap, Database, Globe, Shield, ArrowRight, Cpu, Network } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#ED5729] selection:text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="relative">
              <Brain className="w-8 h-8 text-[#ED5729] relative z-10 group-hover:rotate-12 transition-transform duration-500" />
              <div className="absolute inset-0 bg-[#ED5729]/20 blur-lg rounded-full" />
            </div>
            <span className="text-2xl font-bold font-heading tracking-tight uppercase">
              LoopMemory
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="hidden md:block text-sm font-medium hover:text-[#ED5729] transition-colors uppercase tracking-widest"
            >
              Dashboard
            </Link>
            <Link
              href="/login"
              className="px-6 py-2 bg-[#ED5729] text-white font-bold uppercase tracking-wider hover:bg-[#ff6b3d] transition-all clip-path-slant"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#111111_1px,transparent_1px),linear-gradient(to_bottom,#111111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left z-10 animate-fade-in">
            <div className="inline-flex items-center gap-2 text-[#ED5729] font-mono text-sm mb-6 border border-[#ED5729]/30 px-3 py-1 bg-[#ED5729]/5">
              <span className="w-2 h-2 bg-[#ED5729] rounded-sm animate-pulse" />
              SYSTEM ONLINE // V1.0.0
            </div>
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold leading-[0.9] tracking-tighter mb-8 font-heading uppercase">
              Universal
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500">
                Memory
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-400 mb-10 max-w-xl font-light border-l-2 border-[#ED5729] pl-6">
              Semantic storage and retrieval for your AI assistants.
              <span className="block mt-2 text-white font-medium">Synced. Searchable. Persistent.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard" className="group relative px-8 py-4 bg-white text-black font-bold text-lg uppercase tracking-wider hover:bg-[#ED5729] hover:text-white transition-all overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Start Building <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link href="/docs" className="px-8 py-4 border border-neutral-700 text-neutral-300 font-bold text-lg uppercase tracking-wider hover:border-white hover:text-white transition-colors">
                Documentation
              </Link>
            </div>
          </div>

          {/* Abstract Industrial Visual */}
          <div className="relative h-[600px] hidden lg:block animate-slide-in">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#ED5729]/10 to-transparent rounded-full blur-3xl opacity-30" />
            <div className="relative h-full w-full border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm p-8 flex flex-col justify-between">
              <div className="flex justify-between items-start border-b border-neutral-800 pb-4 mb-4">
                <div className="font-mono text-xs text-[#ED5729]">
                  MEMORY_CORE_STATUS
                  <br />
                  <span className="text-white text-lg">ACTIVE</span>
                </div>
                <Cpu className="w-12 h-12 text-neutral-700" />
              </div>

              <div className="space-y-4 font-mono text-sm text-neutral-500">
                <div className="flex justify-between items-center bg-black/50 p-3 border-l-2 border-[#ED5729]">
                  <span>VECTOR_INDEX_01</span>
                  <span className="text-white">ONLINE</span>
                </div>
                <div className="flex justify-between items-center bg-black/50 p-3 border-l-2 border-neutral-700">
                  <span>MCP_SERVER</span>
                  <span className="text-white">CONNECTED</span>
                </div>
                <div className="flex justify-between items-center bg-black/50 p-3 border-l-2 border-neutral-700">
                  <span>SYNC_PROTOCOL</span>
                  <span className="text-white">IDLE</span>
                </div>
              </div>

              <div className="mt-auto pt-8 border-t border-neutral-800">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-2xl font-bold font-heading text-white">4ms</div>
                    <div className="text-xs text-neutral-500">LATENCY</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-heading text-white">99.9%</div>
                    <div className="text-xs text-neutral-500">UPTIME</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-heading text-[#ED5729]">∞</div>
                    <div className="text-xs text-neutral-500">CAPACITY</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Ticker */}
      <div className="w-full bg-[#ED5729] text-black py-4 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="mx-8 font-heading font-bold text-2xl uppercase flex items-center gap-4">
              Universal Memory <span className="w-2 h-2 bg-black rotate-45" />
              Zero Latency <span className="w-2 h-2 bg-black rotate-45" />
              MCP Standard <span className="w-2 h-2 bg-black rotate-45" />
            </span>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <section className="py-32 px-6 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 border-b border-neutral-800 pb-10">
            <h2 className="text-5xl md:text-7xl font-bold font-heading uppercase mb-6">
              Core Capabilities
            </h2>
            <p className="text-neutral-400 max-w-2xl text-lg">
              Engineered for reliability, speed, and seamless integration with your existing AI workflows.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="w-8 h-8" />}
              title="Semantic Search"
              desc="Powered by Google Gemini embeddings. Finds memories by meaning, not just keywords."
            />
            <FeatureCard
              icon={<Network className="w-8 h-8" />}
              title="MCP Integration"
              desc="Native support for Model Context Protocol. Connect Claude, Cursor, and VSCode instantly."
            />
            <FeatureCard
              icon={<Database className="w-8 h-8" />}
              title="Vector Storage"
              desc="Pinecone-backed vector database for lightning-fast similarity search at scale."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Real-Time Sync"
              desc="Changes reflect instantly across all connected clients and agents."
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Secure Vault"
              desc="Role-level security ensures your memories are private and encrypted."
            />
            <FeatureCard
              icon={<Globe className="w-8 h-8" />}
              title="Universal API"
              desc="Simple REST API to integrate memory into any custom AI application."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-white text-black relative">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-6xl md:text-8xl font-bold font-heading uppercase leading-none mb-10">
            Ready to Upgrade?
          </h2>
          <Link
            href="/dashboard"
            className="inline-flex h-20 items-center px-12 bg-black text-white text-xl font-bold uppercase tracking-widest hover:bg-[#ED5729] transition-colors"
          >
            Start Building Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-neutral-950 border-t border-neutral-900 text-neutral-500 font-mono text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-[#ED5729]" />
            <span className="font-heading font-bold text-white uppercase tracking-wider text-lg">LoopMemory</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-[#ED5729] transition-colors">DOCS</a>
            <a href="#" className="hover:text-[#ED5729] transition-colors">API</a>
            <a href="#" className="hover:text-[#ED5729] transition-colors">GITHUB</a>
          </div>
          <div>
            © 2024 SYSTEM INC.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="group p-8 bg-[#111] border border-neutral-800 hover:border-[#ED5729] transition-all duration-300">
      <div className="mb-6 text-[#ED5729] group-hover:scale-110 transition-transform origin-left">
        {icon}
      </div>
      <h3 className="text-2xl font-bold font-heading uppercase text-white mb-3 group-hover:text-[#ED5729] transition-colors">
        {title}
      </h3>
      <p className="text-neutral-400 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
