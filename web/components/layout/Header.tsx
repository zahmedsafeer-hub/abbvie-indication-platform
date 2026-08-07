"use client";

import React from "react";
import Link from "next/link";
import {
  Activity,
  Award,
  Bot,
  ChevronDown,
  FileText,
  FlaskConical,
  Layers,
  MessageSquare,
  Network,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeProvider";

interface HeaderProps {
  selectedIndication: string;
  onSelectIndication: (indication: string) => void;
  onToggleLeftDrawer?: () => void;
  onToggleRightDrawer?: () => void;
  onOpenHardenerModal?: () => void;
  isLeftOpen?: boolean;
  isRightOpen?: boolean;
}

export function Header({
  selectedIndication,
  onSelectIndication,
  onToggleLeftDrawer,
  onToggleRightDrawer,
  onOpenHardenerModal,
  isLeftOpen,
  isRightOpen,
}: HeaderProps) {
  const indications = [
    { id: "SLE", name: "Systemic Lupus Erythematosus", tag: "Primary Focus" },
    { id: "HS", name: "Hidradenitis Suppurativa", tag: "Autoimmune" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md px-4 py-2.5 flex items-center justify-between shadow-sm dark:shadow-lg transition-colors duration-200">
      
      {/* Left: Indication Dropdown & Thread History Toggle */}
      <div className="flex items-center gap-3">
        {onToggleLeftDrawer && (
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleLeftDrawer}
            className={`text-xs gap-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 ${
              isLeftOpen
                ? "bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-white"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
            title="Toggle Thread History Drawer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-medium">Threads</span>
          </Button>
        )}

        <div className="relative group">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 cursor-pointer hover:border-blue-400 dark:hover:border-slate-700 transition-colors">
            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">
              {selectedIndication}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Dropdown Menu */}
          <div className="absolute left-0 top-full mt-1.5 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 shadow-2xl hidden group-hover:block z-50 animate-fadeIn">
            {indications.map((ind) => (
              <button
                key={ind.id}
                onClick={() => onSelectIndication(ind.name)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between ${
                  selectedIndication === ind.name
                    ? "bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 font-bold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span>{ind.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">{ind.tag}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Center: Semantic Scientific Platform Navigation */}
      <nav className="hidden lg:flex items-center gap-1.5 text-xs font-medium">
        <Link
          href="/test-harness/session"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
          <span>Sessions</span>
        </Link>
        <Link
          href="/test-harness/intent"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
        >
          <Bot className="w-3.5 h-3.5 text-emerald-500" />
          <span>Intent & Citations</span>
        </Link>
        <Link
          href="/test-harness/graph-3d"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
        >
          <Network className="w-3.5 h-3.5 text-indigo-500" />
          <span>3D Graph</span>
        </Link>
        <Link
          href="/test-harness/extractor"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
        >
          <FileText className="w-3.5 h-3.5 text-purple-500" />
          <span>LangExtract</span>
        </Link>
        <Link
          href="/admin/testing"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors font-bold"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Admin Testing</span>
        </Link>
        <Link
          href="/test-harness/eval-runner"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
        >
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <span>RAGAS Audit</span>
        </Link>
      </nav>

      {/* Right: Scientific Tools, Theme Toggle & Corporate Branding */}
      <div className="flex items-center gap-2.5">
        {onOpenHardenerModal && (
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenHardenerModal}
            className="text-xs gap-1.5 px-2.5 rounded-xl border border-purple-200 dark:border-purple-800/60 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60 font-medium"
            title="Scientific Prompt Hardener (PhD Principal Scientist Mode)"
          >
            <FlaskConical className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span className="hidden md:inline">Hardener</span>
          </Button>
        )}

        {/* Global Light / Dark Mode Toggle */}
        <ThemeToggle />

        {/* Corporate Branding Badges */}
        <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black tracking-wider text-slate-900 dark:text-white">
              abbvie
            </span>
            <span className="text-slate-400 dark:text-slate-600 text-xs">|</span>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              Google Cloud
            </span>
          </div>
        </div>
      </div>

    </header>
  );
}
