'use client'

import { Button } from "@/components/ui/button"
import {
  GraduationCap,
  Code2,
  Users,
  ArrowRight,
  Sparkles,
  Shield,
  Rocket,
  IndianRupee,
  CheckCircle2,
  MessageSquare,
  Zap,
  Globe,
  Briefcase,
  Terminal,
  Cpu,
  ShieldCheck,
  TrendingUp,
  Award,
  ArrowUpRight,
  ExternalLink,
  Github,
  Twitter,
  Linkedin,
  Mail,
  ChevronDown,
  Layout,
  Lock,
  Search,
  Eye,
  Settings,
  Database,
  Download
} from "lucide-react"
import Link from "next/link"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import Spline from '@splinetool/react-spline'
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const MONO = "font-mono tracking-tighter text-[10px] uppercase";

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay }}
  >
    {children}
  </motion.div>
)

export default function Home() {
  const containerRef = useRef(null)
  const [isSplineLoaded, setIsSplineLoaded] = useState(false);

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-slate-300 selection:bg-cyan-500/30 overflow-x-hidden font-sans">
      {/* ── Fixed Accents ── */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />

      {/* ── Hero Section ── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black z-10" />
          <Spline
            onLoad={() => setIsSplineLoaded(true)}
            scene="https://prod.spline.design/V5bjQRd4fHXxcIlD/scene.splinecode"
            className={cn("w-full h-full transition-opacity duration-1000", isSplineLoaded ? "opacity-60" : "opacity-0")}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-20 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
            <span className={cn(MONO, "text-slate-400 font-bold")}>v2.0 Protocol_Active</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-tight text-white max-w-5xl mx-auto uppercase"
          >
            THE PLATFORM FOR<br />
            <span className="text-cyan-500 italic">STUDENT</span> BUILDERS.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm md:text-base text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed uppercase tracking-[0.2em] font-medium"
          >
            Bridge the gap between academic theory and industry reality.
            High-fidelity projects, AI assistance, and professional escrow.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              className="h-16 px-12 rounded-2xl bg-white text-black hover:bg-slate-200 text-xs font-black shadow-2xl transition-all hover:scale-105 active:scale-95 group uppercase tracking-widest"
              asChild
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                Launch_System <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-16 px-12 rounded-2xl border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-xs font-black backdrop-blur-sm transition-all uppercase tracking-widest"
              asChild
            >
              <Link href="/jobs">
                Browse_Buffer
              </Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
        >
          <span className={cn(MONO, "text-[8px]")}>Scroll_Down</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </section>

      {/* ── Trust Nodes ── */}
      <section className="py-24 border-b border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          {[
            { label: "Active_Builders", value: "15,000+", icon: <Users className="w-4 h-4" /> },
            { label: "Total_Payouts", value: "₹8.5M+", icon: <IndianRupee className="w-4 h-4" /> },
            { label: "AI_Interactions", value: "250K+", icon: <Sparkles className="w-4 h-4" /> },
            { label: "Partner_Institutes", value: "45+", icon: <GraduationCap className="w-4 h-4" /> }
          ].map((stat, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="flex flex-col items-center md:items-start space-y-2">
                <div className="flex items-center gap-3 text-cyan-500/50">
                  {stat.icon}
                  <span className={cn(MONO)}>{stat.label}</span>
                </div>
                <p className="text-3xl font-black text-white">{stat.value}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── "Why Now?" Problem Section ── */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
          <FadeIn>
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="h-1 w-12 bg-cyan-500" />
                <h2 className="text-5xl md:text-7xl font-black text-white leading-tight uppercase tracking-tighter">
                  Stop the <span className="text-slate-700 italic">"Experience Trap."</span>
                </h2>
              </div>
              <p className="text-slate-500 text-lg leading-relaxed uppercase tracking-widest font-medium">
                You can't get a job without experience, and you can't get experience
                without a job. We break that cycle by providing high-speed project nodes
                designed for students.
              </p>

              <div className="space-y-4 pt-10">
                {[
                  { title: "Skill-Based Ranking", desc: "Your profile is built on actual code commits, not just a resume." },
                  { title: "Real-World Bounties", desc: "Work on legitimate tasks from vetted startups and founders." },
                  { title: "Direct Mentor Uplink", desc: "Get unstuck instantly with 1-on-1 expert sessions." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="p-3 h-fit bg-white/5 rounded-xl group-hover:text-cyan-500 transition-colors">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className={cn(MONO, "text-white text-sm mb-1")}>{item.title}</h4>
                      <p className="text-xs text-slate-600 uppercase tracking-widest leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-white/[0.01] border-white/5 rounded-3xl p-8 space-y-6 transform translate-y-12">
                <Layout className="w-8 h-8 text-cyan-500" />
                <h3 className={cn(MONO, "text-white")}>Professional_Identity</h3>
                <p className="text-[10px] text-slate-600 uppercase tracking-widest">Build a cryptographic resume that proves your skills.</p>
              </Card>
              <Card className="bg-white/[0.01] border-white/5 rounded-3xl p-8 space-y-6">
                <Lock className="w-8 h-8 text-emerald-500" />
                <h3 className={cn(MONO, "text-white")}>Escrow_Security</h3>
                <p className="text-[10px] text-slate-600 uppercase tracking-widest">Payments are locked before you even start the first line of code.</p>
              </Card>
              <Card className="bg-white/[0.01] border-white/5 rounded-3xl p-8 space-y-6 transform translate-y-12">
                <Search className="w-8 h-8 text-violet-500" />
                <h3 className={cn(MONO, "text-white")}>Project_Buffer</h3>
                <p className="text-[10px] text-slate-600 uppercase tracking-widest">Browse hundreds of gigs specifically curated for your tech stack.</p>
              </Card>
              <Card className="bg-white/[0.01] border-white/5 rounded-3xl p-8 space-y-6">
                <Database className="w-8 h-8 text-amber-500" />
                <h3 className={cn(MONO, "text-white")}>Data_Persistence</h3>
                <p className="text-[10px] text-slate-600 uppercase tracking-widest">Your progress is saved across projects, building your trust score.</p>
              </Card>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── AI Assistant Showcase ── */}
      <section className="py-40 px-6 bg-white/[0.01] border-y border-white/5 relative overflow-hidden">
        <div className="absolute -right-20 top-0 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_450px] gap-24 items-center">
          <FadeIn>
            <div className="space-y-8 text-right md:text-left">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4">
                <Sparkles className="w-4 h-4 text-cyan-500" />
                <span className={cn(MONO, "text-cyan-500 font-bold")}>AI_Integration_Active</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white leading-tight uppercase tracking-tighter">
                Never Build <span className="text-cyan-500 italic">Alone.</span>
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed uppercase tracking-widest font-medium">
                Our Gemini-powered assistant is embedded in every project.
                Get instant debugging help, code reviews, and industry
                best practices as you ship your features.
              </p>
              <div className="flex justify-end md:justify-start">
                <Button variant="outline" className="h-14 px-10 rounded-2xl border-white/10 text-xs font-black uppercase tracking-widest">
                  Explore_AI_Features
                </Button>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <Card className="bg-[#0a0a0a] border-white/10 rounded-[2.5rem] p-8 space-y-6 shadow-2xl relative">
              <div className="absolute top-4 left-4 flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
              </div>
              <div className="pt-6 space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex-shrink-0" />
                  <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none">
                    <p className={cn(MONO, "text-[9px] text-slate-500")}>User_Query:</p>
                    <p className="text-[11px] text-slate-300 leading-relaxed mt-1 italic">"How do I optimize this MongoDB aggregation for better latency?"</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex-shrink-0 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-cyan-500" />
                  </div>
                  <div className="bg-cyan-500/5 border border-cyan-500/10 p-4 rounded-2xl rounded-tl-none">
                    <p className={cn(MONO, "text-[9px] text-cyan-500")}>AI_Response:</p>
                    <p className="text-[11px] text-slate-300 leading-relaxed mt-1 uppercase tracking-tighter">Use an indexed field for the $match stage first. I suggest adding a compound index on...</p>
                  </div>
                </div>
              </div>
            </Card>
          </FadeIn>
        </div>
      </section>

      {/* ── Testimonial Wall ── */}
      <section className="py-40 px-6">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">Voices from the <span className="text-cyan-500">Buffer.</span></h2>
            <p className={cn(MONO, "text-slate-600")}>Verified experiences from student builders</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Rahul S.", role: "Frontend Intern", quote: "Got my first payout of ₹15k within 4 days of joining. The escrow system is a lifesaver." },
              { name: "Priya M.", role: "UI Designer", quote: "Working with mentors while doing real projects is the best way to learn. Highly recommended." },
              { name: "Karthik K.", role: "Backend Node", quote: "The AI assistant helped me fix a MongoDB leak that would have taken me hours to find." }
            ].map((t, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <Card className="bg-white/[0.01] border-white/5 rounded-3xl p-8 space-y-6 hover:border-cyan-500/20 transition-all group">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => <Sparkles key={s} className="w-3 h-3 text-cyan-500" />)}
                  </div>
                  <p className="text-sm text-slate-400 italic leading-relaxed">"{t.quote}"</p>
                  <div className="pt-4 border-t border-white/5">
                    <p className="font-bold text-white text-xs uppercase tracking-widest">{t.name}</p>
                    <p className={cn(MONO, "text-[9px] text-slate-600")}>{t.role}</p>
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="py-40 px-6 bg-white/[0.01] border-t border-white/5">
        <div className="max-w-3xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">FAQ_Buffer.</h2>
            <p className={cn(MONO, "text-slate-600")}>Answering common protocol questions</p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {[
              { q: "How do I get paid?", a: "Payments are handled through our secure Smart Escrow nodes. Once the employer releases the funds, they are instantly available in your dashboard balance." },
              { q: "Is experience required?", a: "No. Most projects are tagged as 'Beginner Friendly' and are specifically designed for students to build their professional history." },
              { q: "What if I get stuck?", a: "You have two safety nets: our Gemini AI Assistant for instant help and the Mentor Directory for 1-on-1 expert sessions." },
              { q: "Are the jobs legitimate?", a: "Yes. Every employer is vetted and every job posting is screened before being added to the buffer." }
            ].map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-white/5 bg-white/[0.02] px-6 rounded-2xl overflow-hidden">
                <AccordionTrigger className="hover:no-underline py-6">
                  <span className={cn(MONO, "text-white text-xs text-left")}>{item.q}</span>
                </AccordionTrigger>
                <AccordionContent className="text-slate-500 text-xs uppercase tracking-widest leading-relaxed pb-6">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── Final Call ── */}
      <section className="py-60 px-6 relative">
        <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
          <FadeIn>
            <h2 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-[0.85] uppercase">
              DEPLOY YOUR<br />
              <span className="text-cyan-500 italic">CAREER.</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto uppercase tracking-widest pt-8 font-bold">
              Stop waiting. Start building. Start earning.
            </p>

            <div className="pt-16">
              <Button
                size="lg"
                className="h-24 px-16 bg-white text-black hover:bg-slate-200 rounded-[2.5rem] font-black text-2xl shadow-2xl transition-all hover:scale-110 group"
                asChild
              >
                <Link href="/dashboard" className="flex items-center gap-4">
                  INITIALIZE_NOW <ArrowRight className="w-8 h-8 group-hover:translate-x-3 transition-transform" />
                </Link>
              </Button>
            </div>
          </FadeIn>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-cyan-500/10 blur-[150px] opacity-20 pointer-events-none" />
      </section>

      {/* ── Creator / Architect Section ── */}
      <section className="py-32 px-6 relative border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                <Terminal className="w-4 h-4 text-cyan-500" />
                <span className={cn(MONO, "text-cyan-500 font-bold")}>ARCHITECT_IDENTITY</span>
              </div>
              <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-tight">
                BUILT BY <br />
                <span className="text-cyan-500 italic text-5xl md:text-8xl">Yuviii</span>
              </h2>
              <p className="text-slate-500 text-sm uppercase tracking-[0.2em] leading-loose max-w-md font-medium">
                Full-stack developer & Architect of the FreeLancer Protocol.
                Dedicated to building high-fidelity professional infrastructure
                for student builders.
              </p>
              <div className="flex flex-wrap gap-4 pt-6">
                <Button
                  variant="outline"
                  className="h-14 px-8 rounded-2xl border-white/10 bg-white/[0.02] hover:bg-white/5 text-[10px] font-black uppercase tracking-widest group transition-all"
                  asChild
                >
                  <a href="/Resume.pdf" target="_blank">
                    <Download className="w-4 h-4 mr-2 group-hover:translate-y-0.5 transition-transform" /> Download_Resume
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="h-14 px-8 rounded-2xl border-white/10 bg-white/[0.02] hover:bg-white/5 text-[10px] font-black uppercase tracking-widest group transition-all"
                  asChild
                >
                  <a href="https://www.linkedin.com/in/princeyuvi/" target="_blank">
                    <Linkedin className="w-4 h-4 mr-2 text-cyan-500 group-hover:scale-110 transition-transform" /> LinkedIn_Connect
                  </a>
                </Button>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
              <Card className="bg-[#0a0a0a] border-white/10 backdrop-blur-xl rounded-[2.5rem] p-10 relative overflow-hidden">
                 <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                      <Users className="w-16 h-16 text-slate-800" />
                    </div>
                    <div className="space-y-4 text-center md:text-left">
                      <div>
                        <p className={cn(MONO, "text-cyan-500 mb-1")}>System_Status</p>
                        <p className="text-xl font-bold text-white uppercase tracking-tighter">Available_for_Collab</p>
                      </div>
                      <div className="flex justify-center md:justify-start gap-4">
                        <a href="mailto:yuvisinghrathore678678@gmail.com" className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:text-cyan-500 hover:border-cyan-500/20 transition-all group">
                          <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </a>
                        <a href="https://github.com/princeyuviii" target="_blank" className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:text-white hover:border-white/20 transition-all group">
                          <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </a>
                      </div>
                    </div>
                 </div>
              </Card>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="pt-32 pb-16 px-6 relative overflow-hidden border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto space-y-24 relative z-10">
          <div className="grid md:grid-cols-12 gap-16">
            <div className="md:col-span-5 space-y-8">
              <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Free<span className="text-cyan-500">Lancer</span></h3>
              <p className="text-slate-500 text-xs uppercase tracking-widest leading-loose max-w-sm">
                High-fidelity professional infrastructure for students.
                Bridging the gap between theory and reality.
              </p>
              <div className="flex gap-4">
                {[
                  { Icon: Github, href: "https://github.com/princeyuviii" },
                  { Icon: Linkedin, href: "https://www.linkedin.com/in/princeyuvi/" },
                  { Icon: Mail, href: "mailto:yuvisinghrathore678678@gmail.com" }
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/[0.03] border border-white/5 rounded-xl text-slate-500 hover:text-cyan-500 transition-all"
                  >
                    <social.Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <h4 className={cn(MONO, "text-slate-400")}>Protocol</h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                <li><Link href="/jobs" className="hover:text-cyan-500 transition-colors">Job_Buffer</Link></li>
                <li><Link href="/mentors" className="hover:text-cyan-500 transition-colors">Mentor_Nodes</Link></li>
                <li><Link href="/ai-assistant" className="hover:text-cyan-500 transition-colors">AI_Assistant</Link></li>
              </ul>
            </div>

            <div className="md:col-span-2 space-y-6">
              <h4 className={cn(MONO, "text-slate-400")}>Security</h4>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-slate-600">
                <li><Link href="/escrow" className="hover:text-cyan-500 transition-colors">Smart_Escrow</Link></li>
                <li><Link href="/safety" className="hover:text-cyan-500 transition-colors">Safety_Logs</Link></li>
              </ul>
            </div>

            <div className="md:col-span-3 space-y-6">
              <h4 className={cn(MONO, "text-slate-400")}>Stay_Updated</h4>
              <div className="relative">
                <input
                  type="email"
                  placeholder="USER@NODE.COM"
                  className="w-full bg-white/[0.02] border border-white/10 h-12 px-4 rounded-xl font-mono text-[10px] focus:outline-none focus:border-cyan-500/50 transition-all"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-cyan-500 hover:text-white">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className={cn(MONO, "text-slate-700")}>© 2026 FreeLancer_Protocol // Latency: 14ms</p>
            <div className="flex gap-8 opacity-10 grayscale">
               <div className="text-[10px] font-black tracking-widest">STRIPE</div>
               <div className="text-[10px] font-black tracking-widest">CLERK</div>
               <div className="text-[10px] font-black tracking-widest">GEMINI</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
