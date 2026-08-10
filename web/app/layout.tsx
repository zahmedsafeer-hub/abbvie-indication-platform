import "./globals.css";
import React from "react";
import Link from "next/link";
import {
  Activity,
  Award,
  Bot,
  FileText,
  MessageSquare,
  Network,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ThemeProvider, ThemeToggle } from "@/components/theme/ThemeProvider";
import { ChatProvider } from "@/context/ChatContext";
import { GlobalLiveChatDrawer } from "@/components/layout/GlobalLiveChatDrawer";

export const metadata = {
  title: "AbbVie Indication Knowledge Platform",
  description: "Target Prioritization, Clinical Pipeline, Combination Synergy, 3D Molecular Graph, and Scientific Prompt Hardener",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen flex flex-col antialiased selection:bg-blue-600 selection:text-white transition-colors duration-200">
        <ThemeProvider>
          <ChatProvider>
            {children}
            <GlobalLiveChatDrawer />
          </ChatProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
