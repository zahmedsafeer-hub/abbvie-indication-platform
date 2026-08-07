"use client";

import React, { useState } from "react";
import {
  ArrowUp,
  Camera,
  FileUp,
  FlaskConical,
  Mic,
  MicOff,
  Paperclip,
  Search,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface OmniBarProps {
  onSendMessage: (text: string) => void;
  onOpenDocModal?: () => void;
  onOpenHardenerModal?: (currentQuery: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function OmniBar({
  onSendMessage,
  onOpenDocModal,
  onOpenHardenerModal,
  disabled,
  placeholder,
  className,
}: OmniBarProps) {
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSendMessage(input.trim());
    setInput("");
  };

  const toggleMic = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setInput("What are the combination synergy scores for IL6 and TNFSF13B?");
    }
  };

  const handleLaunchHardener = () => {
    if (onOpenHardenerModal) {
      onOpenHardenerModal(input.trim());
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto px-2 sm:px-4 ${className || ""}`}>
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center bg-white dark:bg-slate-900/95 backdrop-blur-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600/70 focus-within:border-blue-600 dark:focus-within:border-blue-500 rounded-3xl p-2 sm:p-2.5 shadow-xl dark:shadow-2xl dark:shadow-blue-950/20 focus-within:ring-4 focus-within:ring-blue-500/15 transition-all duration-200"
      >
        {/* Document / Camera Upload Button (LangExtract) */}
        <button
          type="button"
          onClick={onOpenDocModal}
          className="p-2.5 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors flex-shrink-0"
          title="Upload Lab Document / Launch LangExtract OCR"
        >
          <FileUp className="w-5 h-5" />
        </button>

        {/* Scientific Prompt Hardener (PhD Mode) Button */}
        <button
          type="button"
          onClick={handleLaunchHardener}
          className="p-2.5 rounded-2xl text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-colors flex-shrink-0 hidden sm:flex items-center gap-1.5"
          title="Launch Scientific Prompt Hardener (PhD Principal Scientist Persona)"
        >
          <FlaskConical className="w-5 h-5" />
          <span className="text-[11px] font-bold font-mono text-purple-700 dark:text-purple-300 hidden md:inline">
            Harden Prompt
          </span>
        </button>

        {/* Microphone / Dictation Button */}
        <button
          type="button"
          onClick={toggleMic}
          className={`p-2.5 rounded-2xl transition-colors flex-shrink-0 ${
            isRecording
              ? "text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/60 border border-rose-400 dark:border-rose-800 animate-pulse"
              : "text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/80"
          }`}
          title="Voice Ingest / Dictation"
        >
          {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Prominent Search / Scientific Query Input */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled}
          placeholder={
            placeholder ||
            "Ask about ARCH targets, clinical assets (ABBV-599), γδ17 screen, or combination synergy..."
          }
          className="flex-1 bg-transparent px-3 py-2.5 text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none font-medium tracking-tight"
        />

        {/* Send Button */}
        <Button
          type="submit"
          disabled={disabled || !input.trim()}
          size="sm"
          className="h-10 w-10 sm:h-11 sm:w-11 p-0 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md shadow-blue-500/25 disabled:opacity-35 flex-shrink-0"
          title="Submit Scientific Inquiry"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      </form>
    </div>
  );
}
