'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  Home, 
  Briefcase, 
  Users, 
  Bot, 
  Github, 
  Linkedin,
  Terminal,
  Zap
} from "lucide-react";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const MONO = "font-mono tracking-tighter text-[10px] uppercase font-bold";

function RoleBadge() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => setRole(data.role))
      .catch(() => setRole("Freelancer"));
  }, []);

  if (!role) return null;

  const roleStyles: Record<string, string> = {
    'Employer': 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]',
    'Mentor': 'bg-violet-500/10 text-violet-400 border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]',
    'Freelancer': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
  };

  return (
    <div className={cn(
      "px-3 py-1 rounded-full border transition-all duration-500",
      MONO,
      roleStyles[role] || roleStyles['Freelancer']
    )}>
      {role}_Protocol
    </div>
  );
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up");

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: <Home className="w-3.5 h-3.5" /> },
    { href: "/jobs", label: "Job_Buffer", icon: <Briefcase className="w-3.5 h-3.5" /> },
    { href: "/mentors", label: "Mentor_Nodes", icon: <Users className="w-3.5 h-3.5" /> },
    { href: "/ai-assistant", label: "AI_Core", icon: <Bot className="w-3.5 h-3.5" /> },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        "fixed w-full top-0 z-[100] transition-all duration-500",
        scrolled
          ? "py-3 bg-black/60 backdrop-blur-xl border-b border-white/5"
          : "py-6 bg-transparent"
      )}
    >
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* ── Logo ── */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute -inset-2 bg-cyan-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <img
                  src="/freelancer-logo.png"
                  alt="Logo"
                  className="h-9 w-auto relative z-10 transition-transform duration-500 group-hover:rotate-[360deg]"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-black tracking-tighter text-white uppercase group-hover:text-cyan-400 transition-colors">
                  Free<span className="text-cyan-500 italic">Lancer</span>
                </span>
                <span className={cn(MONO, "text-[8px] text-slate-500 tracking-[0.3em]")}>
                  System_v2.0
                </span>
              </div>
            </Link>

            {/* ── Desktop Links ── */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all group",
                      isActive ? "text-white" : "text-slate-500 hover:text-white"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-glow"
                        className="absolute inset-0 bg-white/[0.03] border border-white/5 rounded-xl -z-10"
                      />
                    )}
                    <span className={cn("transition-transform group-hover:scale-110", isActive ? "text-cyan-500" : "text-slate-500")}>
                      {link.icon}
                    </span>
                    <span className={MONO}>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 border-r border-white/5 pr-4 mr-2">
              <a href="https://github.com/princeyuviii" target="_blank" className="p-2 text-slate-500 hover:text-white transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://www.linkedin.com/in/princeyuvi/" target="_blank" className="p-2 text-slate-500 hover:text-cyan-500 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>

            <SignedIn>
              <div className="flex items-center gap-4">
                <div className="hidden md:block">
                  <RoleBadge />
                </div>
                <div className="p-1 rounded-full border border-white/5 bg-white/[0.02]">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{ 
                      elements: { 
                        avatarBox: "h-8 w-8 rounded-full ring-2 ring-cyan-500/20 hover:ring-cyan-500/40 transition-all" 
                      } 
                    }}
                  />
                </div>
              </div>
            </SignedIn>

            {!isAuthPage && (
              <SignedOut>
                <div className="flex items-center gap-2">
                  <SignInButton mode="modal">
                    <Button 
                      variant="ghost" 
                      className={cn(MONO, "text-slate-400 hover:text-white hover:bg-white/5")}
                    >
                      Login
                    </Button>
                  </SignInButton>
                  <SignInButton mode="modal">
                    <Button 
                      className={cn(
                        MONO, 
                        "bg-white text-black hover:bg-slate-200 rounded-xl px-6 h-10 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                      )}
                    >
                      Access_Node
                    </Button>
                  </SignInButton>
                </div>
              </SignedOut>
            )}

            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:bg-white/5 rounded-xl"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-2xl border-b border-white/5 overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6">
              <div className="grid gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl transition-all",
                      pathname === link.href ? "bg-white/5 text-white" : "text-slate-500 hover:bg-white/[0.02]"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center gap-4">
                      <span className={pathname === link.href ? "text-cyan-500" : "text-slate-500"}>
                        {link.icon}
                      </span>
                      <span className={MONO}>{link.label}</span>
                    </div>
                    <Zap className={cn("w-3 h-3 opacity-0", pathname === link.href && "opacity-100 text-cyan-500 animate-pulse")} />
                  </Link>
                ))}
              </div>

              <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
                <SignedIn>
                  <div className="flex items-center justify-between p-2">
                    <RoleBadge />
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </SignedIn>
                
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button className={cn(MONO, "w-full h-14 bg-white text-black rounded-2xl")}>
                      Access_Protocol
                    </Button>
                  </SignInButton>
                </SignedOut>

                <div className="flex justify-center gap-8 pt-4">
                  <a href="https://github.com/princeyuviii" className="text-slate-500 hover:text-white">
                    <Github className="w-5 h-5" />
                  </a>
                  <a href="https://www.linkedin.com/in/princeyuvi/" className="text-slate-500 hover:text-cyan-500">
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}