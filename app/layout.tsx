import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Inter, Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./providers/auth-provider";
import Prism from "./components/Prism";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LoopMemory - The Universal Cortex for AI Agents",
    template: "%s | LoopMemory"
  },
  description: "The context engineering infrastructure for AI agents. Store, recall, and personalize interactions in milliseconds with Vector Graph Engine and MCP.",
  keywords: ["MCP", "Model Context Protocol", "AI Memory", "Vector Database", "Knowledge Graph", "LLM Context", "AI Agents", "Semantic Search", "RAG"],
  openGraph: {
    title: "LoopMemory - The Universal Cortex for AI Agents",
    description: "Give your AI agents infinite long-term memory. Plug & play MCP server for Claude, Cursor, and custom LLMs.",
    url: "https://loopmemory.vercel.app",
    siteName: "LoopMemory",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png", // Ensure this exists or use a generic placeholder
        width: 1200,
        height: 630,
        alt: "LoopMemory - Universal Memory Cortex",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LoopMemory - Universal Memory for AI",
    description: "The context engineering infrastructure for AI agents. Store & recall in <500ms.",
    creator: "@loopmemory",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Prism />
          {children}
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
