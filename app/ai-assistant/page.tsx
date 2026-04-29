"use client";

import { useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Bot, User, Send, Terminal, Plus, MessageSquare,
  Paperclip, ArrowUpRight, ChevronLeft, ChevronRight,
  Cpu, Layers, Copy, Check, CheckCircle2, RefreshCw,
  LayoutDashboard, Briefcase, Users,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

const MONO = "font-mono tracking-tighter text-[10px] uppercase text-slate-600";

const STARTER_PROMPTS = [
  { label: "Architecture Review", icon: <Layers className="h-4 w-4 shrink-0" />, prompt: "Please review my project architecture and suggest improvements." },
  { label: "Bug Diagnostics",     icon: <Terminal className="h-4 w-4 shrink-0" />, prompt: "I have a bug I can't track down. Can you help me debug it?" },
  { label: "Performance Audit",   icon: <Cpu className="h-4 w-4 shrink-0" />,     prompt: "Can you do a performance audit and suggest optimizations?" },
  { label: "Proposal Refinement", icon: <MessageSquare className="h-4 w-4 shrink-0" />, prompt: "Can you help me refine my freelance project proposal?" },
];

// Real nav links — each goes to an actual page
const NAV_LINKS = [
  { icon: <LayoutDashboard className="h-4 w-4" />, tip: "Dashboard", href: "/dashboard" },
  { icon: <Briefcase className="h-4 w-4" />,       tip: "Find Work",  href: "/jobs"      },
  { icon: <Users className="h-4 w-4" />,           tip: "Mentors",   href: "/mentors"   },
];

export default function AIAssistant() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput, setMessages } = useChat({ api: "/api/chat" });

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [copiedId, setCopiedId]       = useState<string | null>(null);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const copyToClipboard = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied!", { style: { background: "#0a0a0a", border: "1px solid #222", color: "#e2e8f0" }, icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />, duration: 1500 });
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    toast.success("Session cleared", { style: { background: "#0a0a0a", border: "1px solid #222", color: "#e2e8f0" }, duration: 1500 });
  }, [setMessages]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500_000) { toast.error("File too large (max 500 KB)"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      setInput(`${input}\n\n**File: ${file.name}**\n\`\`\`\n${content.slice(0, 8000)}\n\`\`\``);
      toast.success(`Attached: ${file.name}`, { style: { background: "#0a0a0a", border: "1px solid #222", color: "#e2e8f0" } });
    };
    reader.readAsText(file);
    // Reset so same file can be re-uploaded
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) handleSubmit(e as any);
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-[#080808] text-slate-300 overflow-hidden">

      {/* ── Left Icon Rail — real nav links + clear action ── */}
      <aside className="w-14 shrink-0 border-r border-white/[0.05] flex flex-col items-center py-6 gap-2 bg-[#080808] z-30">
        {/* AI icon — active indicator */}
        <div className="relative p-2.5 rounded-xl text-white bg-white/[0.08] mb-4">
          <MessageSquare className="h-4 w-4" />
          <span className="absolute left-0 top-1/4 bottom-1/4 w-px bg-white rounded-full" />
        </div>

        {/* Real page navigation */}
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            title={link.tip}
            className="p-2.5 rounded-xl text-slate-600 hover:text-slate-300 hover:bg-white/[0.04] transition-all"
          >
            {link.icon}
          </Link>
        ))}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Clear chat — bottom of rail */}
        <button
          onClick={clearChat}
          title="Clear conversation"
          className="p-2.5 rounded-xl text-slate-600 hover:text-white hover:bg-white/[0.04] transition-all"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </aside>

      {/* ── Collapsible session sidebar ── */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            key="sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="shrink-0 border-r border-white/[0.05] bg-[#080808] flex flex-col overflow-hidden z-20"
          >
            <div className="flex flex-col h-full p-5 overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <span className={MONO}>Sessions</span>
                <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-lg text-slate-600 hover:text-white hover:bg-white/[0.04] transition-all">
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>

              {/* New session = clear messages */}
              <button
                onClick={clearChat}
                className="mb-5 w-full flex items-center justify-between px-4 h-10 rounded-xl bg-white text-black text-sm font-semibold hover:bg-slate-100 transition-colors group"
              >
                <span>New Session</span>
                <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
              </button>

              {/* Starter prompts as "quick sessions" */}
              <p className={cn(MONO, "mb-2 px-1")}>Quick starts</p>
              <ScrollArea className="flex-1 -mx-1">
                <div className="space-y-0.5 px-1">
                  {STARTER_PROMPTS.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => { setInput(p.prompt); setSidebarOpen(false); }}
                      className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/[0.04] group transition-all flex items-center gap-3"
                    >
                      <span className="text-slate-600 group-hover:text-slate-300 transition-colors shrink-0">{p.icon}</span>
                      <span className="text-[13px] font-medium text-slate-400 group-hover:text-white truncate transition-colors">{p.label}</span>
                    </button>
                  ))}
                </div>
              </ScrollArea>

              {/* Model status */}
              <div className="mt-5 pt-4 border-t border-white/[0.05]">
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className={MONO}>Gemini 2.0 Flash</span>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Sidebar re-open toggle */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute left-14 top-1/2 -translate-y-1/2 z-40 flex items-center justify-center w-5 h-8 bg-[#080808] border border-white/[0.07] rounded-r-lg text-slate-600 hover:text-white transition-colors"
        >
          <ChevronRight className="h-3 w-3" />
        </button>
      )}

      {/* ── Main chat column ── */}
      <div className="flex-1 flex flex-col overflow-hidden relative">

        {/* Top bar */}
        <header className="shrink-0 h-12 flex items-center justify-between px-6 border-b border-white/[0.05] bg-[#080808]">
          <div className="flex items-center gap-4">
            <span className={MONO}>AI Assistant</span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.07]">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Online</span>
            </div>
          </div>
          {/* Only one action here — clear chat */}
          <button
            onClick={clearChat}
            title="Clear conversation"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-slate-600 hover:text-white hover:bg-white/[0.04] transition-all text-[11px] font-mono uppercase tracking-tighter"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Clear
          </button>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full" viewportRef={viewportRef}>
            <div className="max-w-2xl mx-auto px-4 py-10 space-y-10">

              {/* Empty state */}
              {messages.length === 0 && (
                <div className="flex flex-col items-center text-center py-16">
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mb-6">
                    <Bot className="h-7 w-7 text-white" />
                  </motion.div>
                  <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                    className="text-2xl font-semibold text-white tracking-tight mb-2">
                    How can I help?
                  </motion.h2>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                    className="text-slate-500 text-sm leading-relaxed mb-10 max-w-xs">
                    Ask anything about code, freelancing, or career growth.
                  </motion.p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
                    {STARTER_PROMPTS.map((p, i) => (
                      <motion.button key={i}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + i * 0.05 }}
                        onClick={() => setInput(p.prompt)}
                        className="flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all text-left group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="shrink-0 p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.07] text-slate-400 group-hover:text-white transition-colors">{p.icon}</span>
                          <span className="text-[13px] font-medium text-slate-400 group-hover:text-white transition-colors truncate">{p.label}</span>
                        </div>
                        <ArrowUpRight className="h-3.5 w-3.5 text-slate-700 group-hover:text-white shrink-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              {messages.map((m) => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
                  className={cn("flex gap-4", m.role === "user" ? "flex-row-reverse" : "flex-row")}>

                  <div className={cn("shrink-0 h-8 w-8 rounded-xl flex items-center justify-center",
                    m.role === "user" ? "bg-white/[0.06] border border-white/[0.07]" : "bg-white")}>
                    {m.role === "user" ? <User className="h-4 w-4 text-slate-400" /> : <Bot className="h-4 w-4 text-black" />}
                  </div>

                  <div className={cn("flex-1 min-w-0", m.role === "user" ? "flex justify-end" : "")}>
                    <div className={cn(m.role === "user"
                      ? "inline-block max-w-[85%] bg-white/[0.05] border border-white/[0.07] rounded-2xl rounded-tr-sm px-4 py-3 text-[14px] text-slate-200 leading-relaxed"
                      : "w-full")}>
                      {m.role === "user" ? (
                        <p>{m.content}</p>
                      ) : (
                        <ReactMarkdown
                          className="prose prose-invert max-w-none text-[14px] prose-p:text-slate-300 prose-p:leading-relaxed prose-p:my-2 prose-headings:text-white prose-strong:text-white prose-li:text-slate-300"
                          components={{
                            pre({ children }) { return <div className="not-prose my-5">{children}</div>; },
                            code({ node, inline, className, children, ...props }: any) {
                              const match = /language-(\w+)/.exec(className || "");
                              const codeStr = String(children).replace(/\n$/, "");
                              const blockId = `${m.id}-${codeStr.slice(0, 10)}`;
                              if (!inline && match) {
                                return (
                                  <div className="rounded-xl overflow-hidden border border-white/[0.07] bg-[#0d0d0d] shadow-2xl">
                                    <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.05] bg-white/[0.02]">
                                      <div className="flex items-center gap-3">
                                        <div className="flex gap-1.5">
                                          <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                                          <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                                          <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                                        </div>
                                        <span className={cn(MONO, "text-slate-500")}>{match[1]}</span>
                                      </div>
                                      <button onClick={() => copyToClipboard(codeStr, blockId)}
                                        className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-slate-600 hover:text-white hover:bg-white/[0.06] transition-all text-[11px] font-mono uppercase tracking-tighter">
                                        {copiedId === blockId
                                          ? <><Check className="h-3.5 w-3.5 text-emerald-400" /><span className="text-emerald-400">Copied</span></>
                                          : <><Copy className="h-3.5 w-3.5" /><span>Copy</span></>}
                                      </button>
                                    </div>
                                    <div className="overflow-x-auto">
                                      <code className="block p-5 text-[13px] font-mono leading-relaxed text-slate-300 whitespace-pre" {...props}>{children}</code>
                                    </div>
                                  </div>
                                );
                              }
                              return <code className="bg-white/[0.08] text-cyan-300 px-1.5 py-0.5 rounded-md font-mono text-[12px]" {...props}>{children}</code>;
                            },
                          }}
                        >
                          {m.content}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Thinking dots */}
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-4">
                  <div className="shrink-0 h-8 w-8 rounded-xl bg-white flex items-center justify-center">
                    <Bot className="h-4 w-4 text-black" />
                  </div>
                  <div className="flex items-center gap-1.5 pt-2.5">
                    {[0, 0.15, 0.3].map((delay, i) => (
                      <motion.div key={i}
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                        transition={{ repeat: Infinity, duration: 1.2, delay }}
                        className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>
          </ScrollArea>
        </div>

        {/* ── Input area ── */}
        <div className="shrink-0 px-4 pb-5 pt-3 border-t border-white/[0.05] bg-[#080808]">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit}
              className={cn("relative flex flex-col rounded-2xl border transition-all duration-200 bg-[#0e0e0e]",
                input.trim() ? "border-white/[0.12]" : "border-white/[0.06]")}>

              {/* Toolbar */}
              <div className="flex items-center gap-1 px-3 pt-2 pb-1">
                {/* File attach — real file picker */}
                <label htmlFor="file-upload-ai" title="Attach a code file"
                  className="p-1.5 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-white/[0.04] cursor-pointer transition-all">
                  <Paperclip className="h-4 w-4" />
                  <input id="file-upload-ai" ref={fileInputRef} type="file"
                    className="hidden"
                    accept=".txt,.js,.ts,.jsx,.tsx,.py,.java,.go,.rs,.json,.md,.css,.html,.xml,.yaml,.yml"
                    onChange={handleFileUpload} />
                </label>

                <div className="ml-auto">
                  <Badge className="bg-transparent border border-white/[0.07] text-slate-700 text-[9px] uppercase font-mono tracking-widest py-0 h-5">
                    Flash
                  </Badge>
                </div>
              </div>

              {/* Textarea */}
              <div className="px-4 pb-3">
                <textarea ref={textareaRef} value={input} onChange={handleInputChange} onKeyDown={handleKeyDown}
                  placeholder="Ask anything..." rows={1}
                  className="w-full bg-transparent text-[14px] text-slate-200 placeholder:text-slate-700 resize-none border-0 focus:outline-none focus:ring-0 leading-relaxed py-1 max-h-[200px]" />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-4 pb-3">
                <span className={cn(MONO, "text-slate-700")}>
                  {isLoading ? "Processing..." : "Enter ↵ · Shift+Enter for newline"}
                </span>
                <Button type="submit" disabled={!input.trim() || isLoading}
                  className={cn("h-8 w-8 rounded-xl p-0 flex items-center justify-center transition-all",
                    input.trim() && !isLoading ? "bg-white text-black hover:bg-slate-200 shadow-sm" : "bg-white/[0.04] text-slate-700 cursor-not-allowed")}>
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            </form>

            <p className={cn(MONO, "text-center mt-3 text-slate-800")}>
              FreeLancer AI · Gemini 2.0 Flash · Context-aware
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}