"use client";

import React, { useState, useMemo } from "react";
import {
  MessageSquare,
  Plus,
  Search,
  Trash2,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThreadSessionData } from "@/types/platform";

interface ThreadHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ThreadSessionData[];
  activeThreadId: string;
  onSelectThread: (threadId: string) => void;
  onCreateNewThread: () => void;
  onDeleteThread: (threadId: string) => void;
}

export function ThreadHistoryDrawer({
  isOpen,
  onClose,
  sessions,
  activeThreadId,
  onSelectThread,
  onCreateNewThread,
  onDeleteThread,
}: ThreadHistoryDrawerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessions;
    const q = searchQuery.toLowerCase();
    return sessions.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.threadId.toLowerCase().includes(q) ||
        s.history.some((turn) => turn.content.toLowerCase().includes(q))
    );
  }, [sessions, searchQuery]);

  if (!isOpen) return null;

  return (
    <aside
      data-testid="thread-history-drawer"
      className="fixed inset-y-0 left-0 z-50 w-72 sm:w-80 bg-slate-950/95 backdrop-blur-xl border-r border-slate-800 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out"
    >
      {/* Header */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-400" />
          <span className="font-bold text-white text-xs sm:text-sm">Research Threads</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* New Thread Button */}
      <div className="p-3 border-b border-slate-800/80">
        <Button
          onClick={onCreateNewThread}
          size="sm"
          className="w-full bg-blue-600 hover:bg-blue-700 text-xs font-bold gap-1.5 shadow-md shadow-blue-500/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Isolated Thread</span>
        </Button>
      </div>

      {/* Real-Time Keyword Search Bar */}
      <div className="p-3 border-b border-slate-800/60">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords in threads..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto custom-scroll p-3 space-y-2">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-8 space-y-1 text-slate-500 text-xs">
            <Search className="w-6 h-6 mx-auto text-slate-600" />
            <p>No matching threads found.</p>
          </div>
        ) : (
          filteredSessions.map((s) => (
            <div
              key={s.threadId}
              onClick={() => onSelectThread(s.threadId)}
              className={`group p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between space-y-1.5 ${
                activeThreadId === s.threadId
                  ? "bg-blue-950/60 border-blue-500 shadow-md shadow-blue-500/10"
                  : "bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-blue-400 font-bold truncate max-w-[150px]">
                  {s.threadId}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteThread(s.threadId);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-opacity p-0.5"
                  title="Delete Thread & Purge State"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="font-semibold text-white text-xs leading-snug line-clamp-2">
                {s.title}
              </p>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>{s.history.length} turns</span>
                {s.clarificationCount > 0 && (
                  <Badge variant="warning" className="text-[9px] py-0 px-1.5">
                    Clarif: {s.clarificationCount}/2
                  </Badge>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-950 text-[10px] text-slate-500 text-center font-mono">
        {sessions.length} Isolated Active Sessions
      </div>
    </aside>
  );
}
