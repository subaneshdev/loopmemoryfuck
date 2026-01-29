import Link from "next/link";
import { Brain, Database, Zap, Network, Layers, Cpu, ArrowRight, Share2, Box, Search, Lock } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#03030f] text-white selection:bg-[#00F0FF] selection:text-black overflow-x-hidden">
      {/* Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1f293a_1px,transparent_1px),linear-gradient(to_bottom,#1f293a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none -z-10" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-card border-b-0 border-b-white/5 rounded-b-2xl mx-auto max-w-[95%] left-0 right-0 mt-4 h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00F0FF] to-[#7000FF] flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.5)]">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold font-heading tracking-wide">LoopMemory</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/docs" className="hidden md:block text-sm text-[#8899aa] hover:text-[#00F0FF] transition-colors font-mono">
            DOCS
          </Link>
          <Link href="/pricing" className="hidden md:block text-sm text-[#8899aa] hover:text-[#00F0FF] transition-colors font-mono">
            PRICING
          </Link>
          <Link
            href="/dashboard"
            className="px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00F0FF] text-white rounded-lg text-sm font-medium transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)] hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]"
          >
            LAUNCH APP
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7000FF] rounded-full filter blur-[150px] opacity-20" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00F0FF] rounded-full filter blur-[150px] opacity-10" />

        <div className="z-10 max-w-5xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#00F0FF] mb-4 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
            V1.0.0 ONLINE
          </div>

          <h1 className="text-6xl md:text-8xl font-bold font-heading leading-tight tracking-tight">
            THE UNIVERSAL<br />
            <span className="text-gradient-primary">CORTEX FOR AI</span>
          </h1>

          <p className="text-xl text-[#8899aa] max-w-2xl mx-auto leading-relaxed">
            The context engineering infrastructure for your AI agents.
            <br />
            <span className="text-white">Store, recall, and personalize in milliseconds.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link
              href="/dashboard"
              className="group relative px-8 py-4 bg-white text-black font-bold text-lg rounded-xl hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#00F0FF] to-[#7000FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors">
                START BUILDING <ArrowRight className="w-5 h-5" />
              </div>
            </Link>

            <Link
              href="/docs"
              className="px-8 py-4 bg-transparent border border-white/20 text-white font-medium text-lg rounded-xl hover:border-[#00F0FF] hover:text-[#00F0FF] hover:bg-[#00F0FF]/5 transition-all duration-300"
            >
              READ THE DOCS
            </Link>
          </div>

          {/* Tech Stats */}
          <div className="grid grid-cols-3 gap-8 pt-16 max-w-3xl mx-auto border-t border-white/5 mt-16 text-[#8899aa] font-mono text-sm">
            <div>
              <div className="text-2xl font-bold text-white mb-1"><span className="text-[#00F0FF]">&lt;</span>500ms</div>
              <div>LATENCY</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-1">Vector</div>
              <div>GRAPH ENGINE</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white mb-1">MCP</div>
              <div>READY</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Vertical Flow */}
      <section className="py-32 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-4">
              INFRASTRUCTURE
              <span className="text-[#7000FF]">.FLOW</span>
            </h2>
            <p className="text-[#8899aa] max-w-xl mx-auto">
              A comprehensive pipeline to give your AI agents long-term memory.
            </p>
          </div>

          <div className="space-y-24 relative">
            {/* Connector Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#00F0FF]/30 to-transparent hidden md:block" />

            {/* Step 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center relative">
              <div className="md:text-right order-1 md:order-1">
                <div className="text-[#00F0FF] font-mono text-xl mb-2">01. CONNECT</div>
                <h3 className="text-3xl font-bold font-heading mb-4">PLUG & PLAY</h3>
                <p className="text-[#8899aa] leading-relaxed">
                  Plug LoopMemory into your stack in minutes.
                  Compatible with LangChain, Vercel AI SDK, and custom agents via REST API.
                </p>
              </div>
              <div className="order-2 md:order-2 flex justify-start pl-8 relative">
                <div className="absolute left-0 top-1/2 -translate-x-1/2 w-4 h-4 bg-[#03030f] border-2 border-[#00F0FF] rounded-full hidden md:block shadow-[0_0_10px_#00F0FF]" />
                <StepCard icon={<Network className="w-8 h-8 text-[#00F0FF]" />} title="Integration" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center relative">
              <div className="md:order-2">
                <div className="text-[#7000FF] font-mono text-xl mb-2">02. INGEST</div>
                <h3 className="text-3xl font-bold font-heading mb-4">UNIVERSAL DATA</h3>
                <p className="text-[#8899aa] leading-relaxed">
                  Bring in any type of data, from anywhere.
                  Documents, chat logs, codebases, or distinct memories.
                </p>
              </div>
              <div className="md:order-1 flex justify-end pr-8 relative">
                <div className="absolute right-0 top-1/2 translate-x-1/2 w-4 h-4 bg-[#03030f] border-2 border-[#7000FF] rounded-full hidden md:block shadow-[0_0_10px_#7000FF]" />
                <StepCard icon={<Database className="w-8 h-8 text-[#7000FF]" />} title="Ingestion" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid md:grid-cols-2 gap-12 items-center relative">
              <div className="md:text-right order-1 md:order-1">
                <div className="text-[#00F0FF] font-mono text-xl mb-2">03. EMBED & ENRICH</div>
                <h3 className="text-3xl font-bold font-heading mb-4">MAKE DATA SMART</h3>
                <p className="text-[#8899aa] leading-relaxed">
                  Automatic semantic embedding using Google Gemini.
                  Enriched with metadata for precise retrieval.
                </p>
              </div>
              <div className="order-2 md:order-2 flex justify-start pl-8 relative">
                <div className="absolute left-0 top-1/2 -translate-x-1/2 w-4 h-4 bg-[#03030f] border-2 border-[#00F0FF] rounded-full hidden md:block shadow-[0_0_10px_#00F0FF]" />
                <StepCard icon={<Cpu className="w-8 h-8 text-[#00F0FF]" />} title="Processing" />
              </div>
            </div>

            {/* Step 4 */}
            <div className="grid md:grid-cols-2 gap-12 items-center relative">
              <div className="md:order-2">
                <div className="text-[#7000FF] font-mono text-xl mb-2">04. RECALL</div>
                <h3 className="text-3xl font-bold font-heading mb-4">INSTANT RETRIEVAL</h3>
                <p className="text-[#8899aa] leading-relaxed">
                  Retrieve the right memory, instantly.
                  Vector-graph engine understands user intent just like a human does.
                </p>
              </div>
              <div className="md:order-1 flex justify-end pr-8 relative">
                <div className="absolute right-0 top-1/2 translate-x-1/2 w-4 h-4 bg-[#03030f] border-2 border-[#7000FF] rounded-full hidden md:block shadow-[0_0_10px_#7000FF]" />
                <StepCard icon={<Zap className="w-8 h-8 text-[#7000FF]" />} title="Recall" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-[#050510]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold font-heading mb-12 text-center">
            <span className="text-gradient-primary">TECHNICAL SPECIFICATIONS</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TechCard
              title="Vector-Graph Engine"
              desc="Hybrid search combining vector similarity with knowledge graph relationships."
              icon={<Share2 />}
            />
            <TechCard
              title="MCP Standard"
              desc="Native Model Context Protocol implementation for Claude and IDE integration."
              icon={<Box />} // Changed from Cube to Box (lucide-react default)
            />
            <TechCard
              title="Row-Level Security"
              desc="Enterprise-grade security with granular permission controls per memory."
              icon={<Lock />}
            />
            <TechCard
              title="Real-time Sync"
              desc="WebSocket-powered updates across all connected agents."
              icon={<Zap />}
            />
            <TechCard
              title="Semantic Caching"
              desc="Reduce API costs with intelligent caching of similar queries."
              icon={<Layers />}
            />
            <TechCard
              title="Fuzzy Search"
              desc="Find what you need even with typo-laden or vague queries."
              icon={<Search />}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#00F0FF]/10 to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 glass-card p-12 rounded-3xl border border-white/10">
          <h2 className="text-5xl md:text-7xl font-bold font-heading mb-8">
            BUILD THE <br />
            <span className="text-white">SUPERINTELLIGENCE</span>
          </h2>
          <Link
            href="/dashboard"
            className="inline-block px-12 py-5 bg-[#00F0FF] text-black font-bold text-xl rounded-full hover:shadow-[0_0_40px_rgba(0,240,255,0.6)] hover:scale-105 transition-all"
          >
            GET API KEY
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 bg-[#020205]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-[#8899aa] text-sm font-mono">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Brain className="w-5 h-5 text-[#7000FF]" />
            <span className="text-white">LoopMemory</span>
          </div>
          <div>
            © 2024 LOOPMEMORY LABS. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
}

function StepCard({ icon, title }: { icon: React.ReactNode, title: string }) {
  return (
    <div className="w-full max-w-sm glass-card p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
      <div className="mb-4 p-3 bg-white/5 rounded-xl w-fit">
        {icon}
      </div>
      <div className="text-xl font-bold text-white mb-2 font-heading tracking-wide">{title}</div>
      <div className="h-1 w-12 bg-white/20 rounded-full" />
    </div>
  );
}

function TechCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#00F0FF]/30 transition-all group">
      <div className="mb-4 text-[#8899aa] group-hover:text-[#00F0FF] transition-colors">{icon}</div>
      <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
      <p className="text-sm text-[#8899aa] leading-relaxed">{desc}</p>
    </div>
  );
}
