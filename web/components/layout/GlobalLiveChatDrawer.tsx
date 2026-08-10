"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Send,
  ShieldCheck,
  Sparkles,
  User,
  X,
  RotateCw,
  MessageSquare,
  Zap,
} from "lucide-react";
import { useGlobalChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";

export function GlobalLiveChatDrawer() {
  const {
    isOpen,
    setIsOpen,
    isMinimized,
    setIsMinimized,
    messages,
    activeCitation,
    setActiveCitation,
    isGenerating,
    currentLiveResponse,
    sendMessage,
  } = useGlobalChat();

  const [inputVal, setInputVal] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll whenever new messages arrive or while live tokens are being generated
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, currentLiveResponse, isOpen, isMinimized]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isGenerating) return;
    const q = inputVal.trim();
    setInputVal("");
    await sendMessage(q);
  };

  const handleSampleClick = async (sample: string) => {
    if (isGenerating) return;
    setInputVal("");
    await sendMessage(sample);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-2xl shadow-blue-600/40 hover:shadow-blue-600/60 border-2 border-blue-400/50 hover:scale-105 transition-all duration-200"
        >
          <Bot className="w-5 h-5 animate-pulse" />
          <span>Ask AbbVie AI Assistant</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ease-out flex flex-col ${
        isMinimized
          ? "bottom-6 right-6 w-80 sm:w-96 rounded-2xl shadow-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden"
          : isExpanded
          ? "bottom-4 right-4 left-4 sm:left-auto sm:right-6 sm:w-[700px] h-[85vh] rounded-3xl shadow-2xl border-2 border-blue-500/60 bg-white dark:bg-slate-950 overflow-hidden"
          : "bottom-4 right-4 left-4 sm:left-auto sm:right-6 sm:w-[540px] h-[580px] max-h-[85vh] rounded-3xl shadow-2xl border-2 border-blue-500/60 bg-white dark:bg-slate-950 overflow-hidden"
      }`}
    >
      {/* Top Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-white/20 backdrop-blur-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs sm:text-sm">AbbVie AI Assistant</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 font-mono font-bold">
                ARCH-v6.0
              </span>
            </div>
            <span className="text-[10px] text-blue-100 opacity-90 block">
              Live Grounded Scientific Synthesis
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
            title={isMinimized ? "Open" : "Minimize"}
          >
            {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body Area */}
      {!isMinimized && (
        <div className="flex-1 flex flex-col justify-between overflow-hidden bg-slate-50/70 dark:bg-slate-950">
          
          {/* Scrollable Conversation Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
            {messages.length === 0 && !isGenerating && (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-200 dark:border-blue-800">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  How can I assist your research today?
                </h3>
                <p className="text-slate-500 text-xs max-w-xs mx-auto">
                  Ask any question about ARCH targets, clinical assets (ABBV-599), γδ17 preclinical screens, or combination synergy.
                </p>
              </div>
            )}

            {/* Render Past & Live Messages */}
            {messages.map((turn, idx) => (
              <div
                key={idx}
                className={`flex flex-col space-y-1 ${
                  turn.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                  {turn.role === "user" ? (
                    <User className="w-3 h-3 text-blue-500" />
                  ) : (
                    <Bot className="w-3 h-3 text-emerald-500" />
                  )}
                  <span className="capitalize font-bold text-slate-700 dark:text-slate-300">
                    {turn.role === "user" ? "Scientist (You)" : "AbbVie AI Assistant"}
                  </span>
                  {turn.intent && (
                    <span className="text-[9px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.2 rounded border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                      {turn.intent}
                    </span>
                  )}
                </div>

                <div
                  className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[92%] whitespace-pre-wrap ${
                    turn.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-none shadow-md"
                      : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-md"
                  }`}
                >
                  {turn.content}

                  {/* Citation pills */}
                  {turn.citations && turn.citations.length > 0 && (
                    <div className="mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-1.5">
                      <span className="text-[9px] uppercase font-bold text-slate-400 font-mono">
                        Verified Sources:
                      </span>
                      {turn.citations.map((c, cIdx) => (
                        <button
                          key={cIdx}
                          onClick={() => setActiveCitation(c)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-[10px] font-mono font-bold hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                        >
                          <ShieldCheck className="w-2.5 h-2.5 text-blue-500" />
                          <span>{c.citationTag}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* LIVE STREAMING RESPONSE CARD */}
            {isGenerating && (
              <div className="flex flex-col items-start space-y-1 animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-blue-600 dark:text-blue-400">
                  <Bot className="w-3.5 h-3.5 animate-spin" />
                  <span className="font-bold">Live Synthesizing Answer...</span>
                </div>
                <div className="p-4 rounded-2xl rounded-tl-none bg-blue-50/90 dark:bg-slate-900 border-2 border-blue-500/40 text-slate-900 dark:text-slate-100 text-xs sm:text-sm leading-relaxed shadow-lg max-w-[92%] space-y-2">
                  {currentLiveResponse ? (
                    <div>
                      <span>{currentLiveResponse}</span>
                      <span className="inline-block w-1.5 h-3.5 ml-1 bg-blue-600 animate-pulse"></span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-500 text-xs italic">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                      <span>Retrieving ARCH-v6.0 priors and clinical endpoints...</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Controls & Prominent Input */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-2">
            
            {/* Quick 1-Click Sample Chips */}
            <div className="flex flex-wrap items-center gap-1 text-[10px] font-mono">
              <span className="text-slate-400 font-bold uppercase text-[9px] mr-1">Quick Prompts:</span>
              <button
                type="button"
                onClick={() =>
                  handleSampleClick("What are the 48 node labels and evidence quality rules in ARCH-v6.0?")
                }
                className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                ARCH-v6.0 Schema
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSampleClick("What were the Phase 2 SRI-4 results for ABBV-599 in study M19-130?")
                }
                className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                ABBV-599 SRI-4
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSampleClick("What is the combination synergy between IL-6 and BAFF in SLE?")
                }
                className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 border border-slate-200 dark:border-slate-700 transition-colors"
              >
                IL-6 + BAFF Synergy
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                disabled={isGenerating}
                placeholder="Ask about ARCH targets, trials, assays, or combos..."
                className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-blue-600 font-medium"
              />
              <Button
                type="submit"
                disabled={isGenerating || !inputVal.trim()}
                size="sm"
                className="h-9 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md flex-shrink-0"
              >
                <Send className="w-3.5 h-3.5 mr-1" />
                <span>Send</span>
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
