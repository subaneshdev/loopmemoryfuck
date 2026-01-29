import Link from "next/link";
import { Brain, Database, Zap, Network, Layers, Share2, Box, Search, Lock, ArrowRight, CornerDownRight, Terminal } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f0f0f0] text-black selection:bg-[#FF5500] selection:text-white overflow-x-hidden font-sans">

      {/* Grid Background Layer */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none -z-10" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#f0f0f0]/90 backdrop-blur-sm border-b border-black h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#FF5500] flex items-center justify-center">
            <Brain className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold font-heading tracking-wide">LOOPMEMORY</span>
        </div>
        <div className="flex items-center gap-8 font-mono text-xs uppercase tracking-widest">
          <Link href="/docs" className="hover:text-[#FF5500] transition-colors hidden md:block">Docs</Link>
          <Link href="/pricing" className="hover:text-[#FF5500] transition-colors hidden md:block">Pricing</Link>
          <Link href="/dashboard" className="px-6 py-2 bg-black text-white hover:bg-[#FF5500] transition-colors">
            Launch App
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-16">
        {/* Massive Marquee Header */}
        <div className="border-b border-black bg-white overflow-hidden py-12 md:py-24 relative">
          {/* Scrolling Background Text */}
          <div className="absolute inset-0 flex items-center opacity-[0.03] pointer-events-none select-none">
            <div className="animate-marquee whitespace-nowrap text-[20vw] font-black font-heading leading-none">
              UNIVERSAL MEMORY CORTEX V1.0 // UNIVERSAL MEMORY CORTEX V1.0 //
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <div className="inline-block px-3 py-1 bg-[#FF5500] text-white font-mono text-xs mb-6 uppercase tracking-wider">
              Context Engineering Infrastructure
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black font-heading uppercase leading-[0.9] mb-8 tracking-tighter">
              The Universal<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-black to-[#666] stroke-black">Cortex For AI</span>
            </h1>

            <div className="flex flex-col md:flex-row items-stretch justify-center gap-0 border border-black max-w-2xl mx-auto bg-white">
              <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-black flex items-center justify-center">
                <p className="font-mono text-sm text-[#666]">
                  Store, recall, and personalize <br /> in milliseconds.
                </p>
              </div>
              <Link href="/dashboard" className="flex-1 p-6 bg-black text-white hover:bg-[#FF5500] transition-colors flex items-center justify-center gap-2 font-bold uppercase tracking-wide group">
                Start Building <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Setup Button */}
            <div className="flex justify-center mt-8">
              <Link
                href="/install-mcp"
                className="inline-flex items-center gap-2 px-6 py-3 border border-black bg-white text-black font-mono text-xs uppercase hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px]"
              >
                <Terminal className="w-4 h-4" />
                Setup LoopMemory MCP
              </Link>
            </div>
          </div>

          {/* Decorative Corner Squares */}
          <div className="absolute top-0 left-0 w-4 h-4 bg-[#FF5500]" />
          <div className="absolute top-0 right-0 w-4 h-4 bg-[#FF5500]" />
          <div className="absolute bottom-0 left-0 w-4 h-4 bg-[#FF5500]" />
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#FF5500]" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-black">
          <StatBox number="<500ms" label="Latency" />
          <StatBox number="Vector" label="Graph Engine" />
          <StatBox number="MCP" label="Native Support" />
        </div>

        {/* Feature Flow - Grid Layout */}
        <section className="bg-[#f0f0f0] py-24 px-6 border-b border-black">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-black bg-white shadow-[10px_10px_0px_rgba(0,0,0,0.1)]">

              {/* Left Column - Sticky Title */}
              <div className="lg:col-span-4 p-8 border-b lg:border-b-0 lg:border-r border-black bg-[#fafafa]">
                <div className="sticky top-24">
                  <div className="w-12 h-1 bg-[#FF5500] mb-6" />
                  <h2 className="text-4xl font-bold font-heading uppercase mb-6 leading-none">
                    Infrastructure<br />Pipeline
                  </h2>
                  <p className="font-mono text-sm text-[#666] mb-8">
                    A comprehensive data flow for autonomous agents.
                  </p>
                  <CornerDownRight className="w-12 h-12 text-[#ccc]" />
                </div>
              </div>

              {/* Right Column - Steps */}
              <div className="lg:col-span-8">
                <FlowStep
                  number="01"
                  title="Connect Stack"
                  desc="Plug LoopMemory into your stack in minutes. Compatible with LangChain, Vercel AI SDK, and custom agents via REST API."
                  icon={<Network />}
                />
                <FlowStep
                  number="02"
                  title="Ingest Universal Data"
                  desc="Bring in any type of data, from anywhere. Documents, chat logs, codebases, or distinct memories."
                  icon={<Database />}
                />
                <FlowStep
                  number="03"
                  title="Embed & Enrich"
                  desc="Automatic semantic embedding using Google Gemini. Enriched with metadata for precise retrieval."
                  icon={<Brain />}
                />
                <FlowStep
                  number="04"
                  title="Instant Recall"
                  desc="Retrieve the right memory, instantly. Vector-graph engine understands user intent."
                  icon={<Zap />}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Technical Specs - Brutalist Cards */}
        <section className="py-24 px-6 bg-white border-b border-black">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-12 border-b border-black pb-4">
              <h2 className="text-4xl font-bold font-heading uppercase">System Modules</h2>
              <div className="font-mono text-xs bg-black text-white px-2 py-1">SPEC_SHEET_V1</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <TechCard title="Vector-Graph Engine" icon={<Share2 />} />
              <TechCard title="Row-Level Security" icon={<Lock />} />
              <TechCard title="Real-time Sync" icon={<Zap />} />
              <TechCard title="Semantic Caching" icon={<Layers />} />
              <TechCard title="Fuzzy Search" icon={<Search />} />
              <TechCard title="Universal API" icon={<Box />} />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black text-white py-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#FF5500]" />
              <span className="font-bold font-heading text-xl">LOOPMEMORY</span>
            </div>
            <div className="flex gap-8 font-mono text-sm text-[#999]">
              <a href="#" className="hover:text-white transition-colors">GITHUB</a>
              <a href="#" className="hover:text-white transition-colors">TWITTER</a>
              <a href="#" className="hover:text-white transition-colors">DISCORD</a>
            </div>
            <div className="font-mono text-xs text-[#666]">
              © 2024 SYSTEM INC.
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}

function StatBox({ number, label }: { number: string, label: string }) {
  return (
    <div className="p-12 border-b md:border-b-0 md:border-r border-black text-center hover:bg-[#fafafa] transition-colors group">
      <div className="text-5xl font-black font-heading mb-2 group-hover:text-[#FF5500] transition-colors">
        {number}
      </div>
      <div className="font-mono text-sm uppercase tracking-widest text-[#666]">
        {label}
      </div>
    </div>
  )
}

function FlowStep({ number, title, desc, icon }: { number: string, title: string, desc: string, icon: React.ReactNode }) {
  return (
    <div className="p-8 border-b border-black last:border-b-0 hover:bg-[#fafafa] transition-colors flex gap-6 items-start">
      <div className="font-mono text-[#FF5500] font-bold text-lg pt-1">{number}</div>
      <div>
        <div className="mb-4 text-black">{icon}</div>
        <h3 className="text-2xl font-bold font-heading mb-2 uppercase">{title}</h3>
        <p className="font-sans text-[#666] leading-relaxed max-w-md">{desc}</p>
      </div>
    </div>
  )
}

function TechCard({ title, icon }: { title: string, icon: React.ReactNode }) {
  return (
    <div className="border border-black p-6 bg-[#f0f0f0] hover:bg-[#FF5500] hover:text-white transition-all duration-300 group cursor-default">
      <div className="mb-4 opacity-50 group-hover:opacity-100 group-hover:text-white transition-all">
        {icon}
      </div>
      <h4 className="font-bold font-heading text-xl uppercase">{title}</h4>
    </div>
  )
}
