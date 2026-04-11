import Link from "next/link";
import Image from "next/image";
import { Brain, Zap, Share2, Search, Lock, ArrowRight, Terminal, Globe, Cpu, Database, Layout, Sparkles, Command, History, ShieldCheck, ChevronRight } from "lucide-react";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "LoopMemory",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "The context infrastructure for your AI agents. Universal Memory Cortex.",
    "softwareRequirements": "Node.js, MCP Client (Claude/Cursor)",
    "featureList": ["Vector Graph Engine", "MCP Integration", "Semantic Search", "Real-time Sync"]
  };

  return (
    <div className="min-h-screen bg-white text-slate-950 font-sans selection:bg-blue-600/20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Grid Overlay */}
      <div className="fixed inset-0 bg-grid-white pointer-events-none -z-10 opacity-60" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-slate-200/60 h-16 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Brain className="text-white w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight font-heading">LoopMemory</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="#infra" className="hover:text-primary transition-colors">Infrastructure</Link>
          <Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
          <Link href="/docs" className="hover:text-primary transition-colors">Documentation</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:block text-sm font-medium text-slate-600 hover:text-slate-950">
            Sign In
          </Link>
          <Link href="/dashboard" className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition-all shadow-md shadow-blue-500/10">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20">
        <section className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100/50 text-blue-600 text-xs font-bold mb-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>UNIVERSAL MEMORY CORTEX V1.0</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-heading leading-[1.1] mb-8 tracking-tight text-gradient">
            Infrastructure for<br />
            Infinite AI Context
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 leading-relaxed mb-12">
            Give your AI agents a persistent long-term memory. Store, recall, and connect information in milliseconds with our Vector-Graph infrastructure.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group">
              Start Building <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/install-mcp" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 font-bold rounded-full hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
              <Terminal className="w-4 h-4" /> Setup MCP
            </Link>
          </div>

          <div className="relative max-w-4xl mx-auto animate-float">
             <div className="absolute -inset-4 bg-blue-500/10 rounded-[3rem] blur-2xl -z-10 group-hover:bg-blue-500/20 transition-all duration-1000"></div>
             <Image 
                src="/Users/subanesh/.gemini/antigravity/brain/13a70c72-3815-4abf-a9ab-d88d87981986/loopmemory_hero_visual_1775881601623.png"
                alt="LoopMemory Hero Visual"
                width={1200}
                height={800}
                className="rounded-[2.5rem] border border-white/20 shadow-2xl"
                priority
             />
          </div>
        </section>

        {/* Feature Bento Grid */}
        <section id="features" className="py-32 bg-slate-50/50 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6 tracking-tight">Built for Agentic Workflow</h2>
              <p className="text-slate-500 max-w-xl mx-auto">Everything you need to orchestrate complex context for your autonomous systems.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 lg:gap-6 h-auto md:h-[600px]">
              {/* Feature 1 - Large */}
              <div className="md:col-span-2 md:row-span-1 premium-card p-8 flex flex-col justify-between overflow-hidden relative group">
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-primary">
                    <Database className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 font-heading">Vector Graph Cortex</h3>
                  <p className="text-slate-500 max-w-[300px]">Combines semantic vector search with relational knowledge graphs for 100% accurate recall.</p>
                </div>
                <div className="absolute right-0 bottom-0 translate-y-4 translate-x-4 opacity-5 bg-primary rounded-full w-64 h-64 -z-0 group-hover:scale-110 transition-transform duration-700"></div>
              </div>

              {/* Feature 2 - Tall */}
              <div className="md:col-span-1 md:row-span-2 premium-card p-8 bg-slate-900 border-slate-800 text-white flex flex-col justify-between group overflow-hidden">
                <div>
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 text-blue-400">
                    <Terminal className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 font-heading">Native MCP Server</h3>
                  <p className="text-slate-400">Protocol-native implementation. Directly connect LoopMemory to Claude, Cursor, or any MCP client instantly.</p>
                </div>
                <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10 font-mono text-[10px] text-blue-300">
                  <pre>{`$ npx @loopmemory/mcp install`}</pre>
                  <pre className="opacity-50 mt-1">{`> Authenticating...`}</pre>
                  <pre className="opacity-50 mt-1">{`> Memory Server Online!`}</pre>
                </div>
              </div>

              {/* Feature 3 - Small */}
              <div className="md:col-span-1 md:row-span-1 premium-card p-8 group">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-primary">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2 font-heading">Universally Sync</h3>
                <p className="text-slate-500 text-sm">Real-time synchronization across all your devices and agent instances.</p>
              </div>

              {/* Feature 4 - Small */}
              <div className="md:col-span-1 md:row-span-1 premium-card p-8 group">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-primary">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2 font-heading">Encrypted Store</h3>
                <p className="text-slate-500 text-sm">Enterprise-grade encryption at rest and in memory. Your data is your own.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Infrastructure Section */}
        <section id="infra" className="py-32 bg-[#020617] text-white relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] -z-0"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-6">
                  ENGINE_SPECS_V2
                </div>
                <h2 className="text-4xl md:text-5xl font-bold font-heading mb-8 tracking-tight">The infra pipeline for<br />tomorrow&apos;s agents.</h2>
                
                <div className="space-y-6">
                  <InfraFeature title="Contextual Ingestion" desc="Ingest unstructured data into semantic nodes automatically." />
                  <InfraFeature title="Vector-Graph Mapping" desc="Relational connections mapped alongside vector embeddings." />
                  <InfraFeature title="Low-Latency Recall" desc="Retrieve complex context chains in less than 500ms." />
                </div>

                <div className="mt-12 flex gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold font-heading text-primary">01</div>
                    <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Integrate</div>
                  </div>
                  <div className="h-10 w-px bg-slate-800 self-center"></div>
                  <div className="text-center px-8">
                    <div className="text-3xl font-bold font-heading text-primary">02</div>
                    <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Ingest</div>
                  </div>
                  <div className="h-10 w-px bg-slate-800 self-center"></div>
                  <div className="text-center">
                    <div className="text-3xl font-bold font-heading text-primary">03</div>
                    <div className="text-xs text-slate-500 uppercase tracking-widest mt-1">Recall</div>
                  </div>
                </div>
              </div>

              <div className="dark-glass rounded-3xl p-1 border-white/5 shadow-2xl">
                <div className="bg-[#0a0a0a]/80 p-8 rounded-[1.4rem] border border-white/5 font-mono text-sm leading-relaxed">
                  <div className="flex gap-2 mb-6 border-b border-white/5 pb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40"></div>
                  </div>
                  <div className="text-blue-400">// Ingesting new context layer</div>
                  <div className="text-slate-400 mt-2">
                    <span className="text-purple-400">const</span> memory = <span className="text-blue-300">await</span> loop.<span className="text-blue-300">learn</span>({`{`}
                  </div>
                  <div className="pl-4 text-slate-400">
                    content: <span className="text-blue-200">&quot;Project Apollo Specs v2&quot;</span>,
                  </div>
                  <div className="pl-4 text-slate-400">
                    tags: [<span className="text-blue-200">&quot;engineering&quot;</span>, <span className="text-blue-200">&quot;internal&quot;</span>]
                  </div>
                  <div className="text-slate-400">{`}`});</div>
                  
                  <div className="text-slate-600 mt-6 md:mt-12"># Retrieval latency: 242ms</div>
                  <div className="text-slate-600"># Entities extracted: 14</div>
                  <div className="text-slate-600"># Graph nodes updated: 2</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto dark-glass p-12 md:p-20 rounded-[3rem] text-center bg-primary text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-[80px] -z-0"></div>
            <h2 className="text-3xl md:text-5xl font-bold font-heading mb-8 relative z-10 tracking-tight">Ready to upgrade your AI&apos;s brain?</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 transition-transform group-hover:scale-105 duration-500">
              <Link href="/dashboard" className="w-full sm:w-auto px-10 py-5 bg-white text-primary font-bold rounded-full hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-900/40">
                Get Started for Free
              </Link>
              <Link href="/docs" className="w-full sm:w-auto px-10 py-5 bg-blue-700 text-white font-bold rounded-full hover:bg-blue-800 transition-all flex items-center justify-center gap-2 border border-blue-400/30">
                Read the Docs
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white py-20 px-6 border-t border-slate-100">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="max-w-sm">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                  <Brain className="text-white w-3.5 h-3.5" />
                </div>
                <span className="font-bold font-heading text-xl tracking-tight">LoopMemory</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                The universal context engineering layer for autonomous agents and digital twins. Built for the era of infinite reasoning.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 md:gap-24">
              <FooterColumn title="Product" links={[
                { label: "Features", href: "#features" },
                { label: "Pricing", href: "/pricing" },
                { label: "Enterprise", href: "/pricing" },
                { label: "Case Studies", href: "#" }
              ]} />
              <FooterColumn title="Resources" links={[
                { label: "Documentation", href: "/docs" },
                { label: "API Reference", href: "/docs" },
                { label: "MCP Guide", href: "/install-mcp" },
                { label: "Changelog", href: "#" }
              ]} />
              <FooterColumn title="Company" links={[
                { label: "About", href: "#" },
                { label: "Twitter", href: "#" },
                { label: "Discord", href: "#" },
                { label: "Terms", href: "#" }
              ]} />
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-400 uppercase tracking-widest">
            <div>© 2024 SYSTEM INC. ALL RIGHTS RESERVED.</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function InfraFeature({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="flex gap-4 group cursor-default">
      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0 group-hover:scale-150 transition-transform"></div>
      <div>
        <h4 className="font-bold mb-1 text-slate-200 transition-colors group-hover:text-white">{title}</h4>
        <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

function FooterColumn({ title, links }: { title: string, links: { label: string, href: string }[] }) {
  return (
    <div>
      <h5 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wider">{title}</h5>
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="text-sm text-slate-500 hover:text-primary transition-colors">{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

