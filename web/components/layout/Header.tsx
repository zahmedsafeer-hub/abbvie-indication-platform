"use client";

import React from "react";
import Link from "next/link";
import {
  Activity,
  Award,
  Bot,
  ChevronDown,
  Layers,
  MessageSquare,
  Network,
  Sparkles,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  selectedIndication: string;
  onSelectIndication: (indication: string) => void;
  onToggleLeftDrawer?: () => void;
  onToggleRightDrawer?: () => void;
  isLeftOpen?: boolean;
  isRightOpen?: boolean;
}

export function Header({
  selectedIndication,
  onSelectIndication,
  onToggleLeftDrawer,
  onToggleRightDrawer,
  isLeftOpen,
  isRightOpen,
}: HeaderProps) {
  const indications = [
    { id: "SLE", name: "Systemic Lupus Erythematosus", tag: "Primary Focus" },
    { id: "HS", name: "Hidradenitis Suppurativa", tag: "Autoimmune" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-4 py-2.5 flex items-center justify-between shadow-lg">
      
      {/* Left: Indication Dropdown & Thread Toggle */}
      <div className="flex items-center gap-3">
        {onToggleLeftDrawer && (
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleLeftDrawer}
            className={`text-xs gap-1.5 px-2.5 ${isLeftOpen ? "bg-slate-800 text-white" : "text-slate-400"}`}
            title="Toggle Thread History Drawer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Threads</span>
          </Button>
        )}

        <div className="relative group">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 cursor-pointer hover:border-slate-700 transition-colors">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-bold text-white tracking-tight">
              {selectedIndication}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Dropdown Menu */}
          <div className="absolute left-0 top-full mt-1.5 w-64 bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-2xl hidden group-hover:block z-50">
            {indications.map((ind) => (
              <button
                key={ind.id}
                onClick={() => onSelectIndication(ind.name)}
                className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                  selectedIndication === ind.name
                    ? "bg-blue-600/20 text-blue-400 font-bold"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <span>{ind.name}</span>
                <span className="text-[10px] text-slate-500 font-mono">{ind.tag}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Center: Quick Platform Navigation Links */}
      <nav className="hidden md:flex items-center gap-2 text-xs font-medium">
        <Link
          href="/test-harness/session"
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <MessageSquare className="w-3 h-3 text-blue-400" />
          <span>Sessions</span>
        </Link>
        <Link
          href="/test-harness/intent"
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <Bot className="w-3 h-3 text-emerald-400" />
          <span>Intent & Citations</span>
        </Link>
        <Link
          href="/test-harness/graph-3d"
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <Network className="w-3 h-3 text-indigo-400" />
          <span>3D Graph</span>
        </Link>
        <Link
          href="/test-harness/extractor"
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <FileText className="w-3 h-3 text-purple-400" />
          <span>LangExtract</span>
        </Link>
        <Link
          href="/admin/testing"
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Admin Testing</span>
        </Link>
        <Link
          href="/test-harness/eval-runner"
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <Award className="w-3 h-3 text-amber-400" />
          <span>RAGAS Audit</span>
        </Link>
        <Link
          href="/test-harness/golden-dataset"
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span>45-Case Eval</span>
        </Link>
        <Link
          href="/test-harness"
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <Activity className="w-3 h-3 text-emerald-400" />
          <span>Overview</span>
        </Link>
      </nav>

      {/* Right: AbbVie Branding + Google Cloud Badge + Citation Toggle */}
      <div className="flex items-center gap-3">
        {onToggleRightDrawer && (
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleRightDrawer}
            className={`text-xs gap-1.5 px-2.5 ${isRightOpen ? "bg-slate-800 text-white" : "text-slate-400"}`}
            title="Toggle Citation Side Panel"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Citations</span>
          </Button>
        )}

        <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
          <div className="flex flex-col text-right">
            <span className="text-[11px] font-extrabold tracking-wider text-white">
              abbvie
            </span>
            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">
              Information Research
            </span>
          </div>

          <div className="h-6 w-px bg-slate-800" />

          <div className="flex items-center gap-1 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold text-blue-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span>Google Cloud</span>
          </div>
        </div>
      </div>

    </header>
  );
}
