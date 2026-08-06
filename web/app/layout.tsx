import "./globals.css";
import React from "react";
import Link from "next/link";
import { Activity, Beaker, FileText, GitPullRequest, Layers, Sparkles, Network, Bot, MessageSquare } from "lucide-react";

export const metadata = {
  title: "AbbVie Indication Knowledge Platform (Phase 1a)",
  description: "Target Assessment, Clinical Trials, Combination Synergy, and Preclinical γδ17 T-cell / IL-23 Repurposing Engine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-blue-600 selection:text-white">
        <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <Link href="/" className="font-bold text-lg text-slate-100 hover:text-blue-400 transition-colors">
                  AbbVie Indication Platform
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-semibold text-blue-400 tracking-wider">
                    Phase 1a Indication Engine
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-[10px] text-slate-400">ARCH v2.4</span>
                </div>
              </div>
            </div>

            <nav className="flex items-center gap-3 text-sm font-medium">
              <Link
                href="/test-harness/session"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20 hover:bg-blue-600/20 transition-colors text-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Session State</span>
              </Link>
              <Link
                href="/test-harness/intent"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600/20 transition-colors text-xs"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Intent & Citations</span>
              </Link>
              <Link
                href="/test-harness/graph-3d"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-600/20 transition-colors text-xs"
              >
                <Network className="w-3.5 h-3.5" />
                <span>3D Knowledge Graph</span>
              </Link>
              <Link
                href="/test-harness/extractor"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/10 text-purple-400 border border-purple-500/20 hover:bg-purple-600/20 transition-colors text-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>LangExtract</span>
              </Link>
              <Link
                href="/test-harness"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20 hover:bg-blue-600/20 transition-colors text-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Test Harness</span>
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>

        <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
          AbbVie Indication Knowledge Platform • Phase 1a Architecture • Next.js 14 App Router + FastAPI Data Engine
        </footer>
      </body>
    </html>
  );
}
