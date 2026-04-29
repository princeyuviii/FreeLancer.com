"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Star, 
  MessageSquare, 
  Calendar, 
  Sparkles, 
  MapPin, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ShieldCheck, 
  Clock, 
  Zap,
  Globe,
  ChevronRight,
  Terminal,
  Loader2
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface MentorData {
  _id: string;
  name: string;
  expertise: string;
  rating: number;
  hourlyRate: number;
  image: string;
  specialties: string[];
  availability: string;
  country: string;
  clerkId: string;
}

const MONO_CLASS = "font-mono tracking-tighter text-[10px] uppercase";

export default function MentorsPage() {
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [mentors, setMentors] = useState<MentorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitializingChat, setIsInitializingChat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetch("/api/mentors")
      .then((res) => res.json())
      .then((data) => {
        setMentors(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const filteredMentors = useMemo(() => {
    return mentors.filter(mentor => {
      const matchesSearch = mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            mentor.expertise.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All" || mentor.expertise.includes(activeCategory);
      return matchesSearch && matchesCategory;
    });
  }, [mentors, searchQuery, activeCategory]);

  const handleMessage = async (clerkId: string) => {
    if (!isSignedIn) {
      toast.error("Authentication Required", {
        description: "Please sign in to start a conversation with mentors.",
        style: { background: "#0a0a0a", border: "1px solid #222", color: "#e2e8f0" },
      });
      return;
    }

    if (user?.id === clerkId) {
      toast.error("System Error", {
        description: "You cannot initiate a chat with yourself.",
        style: { background: "#0a0a0a", border: "1px solid #222", color: "#e2e8f0" },
      });
      return;
    }

    setIsInitializingChat(clerkId);
    
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId: clerkId }),
      });

      if (res.ok) {
        toast.success("Connection Established", {
          description: "Redirecting to secure chat channel...",
          style: { background: "#0a0a0a", border: "1px solid #222", color: "#e2e8f0" },
        });
        router.push("/dashboard?tab=messages");
      } else {
        const errorData = await res.text();
        throw new Error(errorData || "Failed to initialize chat");
      }
    } catch (error: any) {
      console.error("Error starting conversation:", error);
      toast.error("Connection Failed", {
        description: error.message || "Unable to establish secure chat link.",
        style: { background: "#0a0a0a", border: "1px solid #222", color: "#e2e8f0" },
      });
    } finally {
      setIsInitializingChat(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate-300 selection:bg-cyan-500/30 overflow-x-hidden font-sans">
      {/* Abstract Background Noise/Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 z-0" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_-20%,_rgba(30,30,30,1)_0%,_rgba(0,0,0,1)_100%)] z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* System Scan Hero */}
        <header className="py-16 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 mb-12">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="h-1 w-8 bg-cyan-500" />
              <span className={cn(MONO_CLASS, "text-cyan-500")}>Node / Mentors_Directory</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold tracking-tighter text-white"
            >
              Expert <span className="italic font-light text-slate-500">Access.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-slate-500 max-w-md text-lg leading-relaxed"
            >
              Connect with verified industry leaders for technical audit, career strategy, and deep-dive mentorship.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-4 bg-white/[0.02] border border-white/5 p-6 rounded-2xl backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <span className={cn(MONO_CLASS, "text-white")}>System Verification Active</span>
            </div>
            <div className="flex gap-8">
              <div>
                <p className={MONO_CLASS}>Uptime</p>
                <p className="text-xl font-bold text-white">99.9%</p>
              </div>
              <div>
                <p className={MONO_CLASS}>Active Nodes</p>
                <p className="text-xl font-bold text-white">{mentors.length}</p>
              </div>
            </div>
          </motion.div>
        </header>

        <div className="flex flex-col lg:flex-row gap-12 pb-24">
          {/* Sidebar Filter Rail */}
          <aside className="w-full lg:w-64 space-y-8">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-cyan-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search Database..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-white/20 focus:bg-white/[0.04] transition-all"
              />
            </div>

            <div className="space-y-4">
              <h3 className={cn(MONO_CLASS, "text-slate-600 px-1")}>Specialization</h3>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {["All", "Frontend", "Backend", "Full Stack", "UI/UX", "DevOps"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "flex items-center justify-between px-4 py-2 rounded-lg text-sm transition-all group",
                      activeCategory === cat 
                        ? "bg-white text-black font-bold" 
                        : "text-slate-500 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <span>{cat}</span>
                    <ChevronRight className={cn("h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity", activeCategory === cat ? "hidden" : "block")} />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-white/5">
              <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Zap className="h-4 w-4 fill-cyan-400" />
                  <span className={cn(MONO_CLASS)}>Priority Access</span>
                </div>
                <p className="text-[11px] text-cyan-400/60 leading-relaxed">
                  Unlock instant meeting bookings with premium verified mentors.
                </p>
                <Button variant="ghost" className="w-full text-cyan-400 hover:bg-cyan-400/10 text-[10px] uppercase font-bold tracking-widest p-0 h-auto py-2">
                  Learn More
                </Button>
              </div>
            </div>
          </aside>

          {/* Mentors Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 4, 5, 6].map(i => (
                  <div key={i} className="h-80 bg-white/[0.02] border border-white/5 rounded-[2.5rem] animate-pulse" />
                ))}
              </div>
            ) : filteredMentors.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredMentors.map((mentor, idx) => (
                    <motion.div
                      key={mentor._id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="group relative"
                    >
                      {/* Mentor Card */}
                      <div className="h-full bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-500 relative overflow-hidden flex flex-col justify-between">
                        {/* Background Accent */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div>
                          <div className="flex justify-between items-start mb-8">
                            <div className="relative">
                              <img 
                                src={mentor.image} 
                                alt={mentor.name}
                                className="w-20 h-20 rounded-[2rem] object-cover border border-white/10 group-hover:border-white/30 transition-all duration-500 grayscale group-hover:grayscale-0"
                              />
                              <div className="absolute -bottom-1 -right-1 bg-black border border-white/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Star className="h-3 w-3 text-cyan-400 fill-cyan-400" />
                                <span className={cn(MONO_CLASS, "text-[9px] text-white")}>{mentor.rating}</span>
                              </div>
                            </div>
                            <Badge variant="outline" className="border-white/5 text-slate-500 bg-white/[0.02] rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-tighter">
                              Verified Expert
                            </Badge>
                          </div>

                          <div className="space-y-1 mb-6">
                            <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-500">
                              {mentor.name}
                            </h3>
                            <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
                              {mentor.expertise} 
                              <span className="h-1 w-1 rounded-full bg-white/20" /> 
                              <span className={cn(MONO_CLASS, "text-[9px] mt-0.5")}>{mentor.country}</span>
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-8">
                            {mentor.specialties.map((s) => (
                              <span key={s} className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] text-slate-400 font-bold uppercase tracking-tighter group-hover:border-white/10 transition-colors">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="flex items-center justify-between pt-6 border-t border-white/5">
                            <div>
                              <p className={cn(MONO_CLASS, "text-slate-600 mb-1")}>Rate_Fixed</p>
                              <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-white">₹{mentor.hourlyRate}</span>
                                <span className="text-xs text-slate-500 uppercase font-bold tracking-tighter">/Session</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={cn(MONO_CLASS, "text-slate-600 mb-1")}>Availability</p>
                              <p className="text-sm font-bold text-white flex items-center justify-end gap-2">
                                <Clock className="h-3.5 w-3.5 text-cyan-500" />
                                {mentor.availability}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <Button 
                              onClick={() => handleMessage(mentor.clerkId)}
                              disabled={isInitializingChat === mentor.clerkId}
                              className="flex-1 bg-white text-black hover:bg-slate-200 rounded-2xl h-12 font-bold group/btn disabled:opacity-50"
                            >
                              {isInitializingChat === mentor.clerkId ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <MessageSquare className="h-4 w-4 mr-2" />
                              )}
                              {isInitializingChat === mentor.clerkId ? "Connecting..." : "Initialize Chat"}
                            </Button>
                            <Button 
                              variant="outline" 
                              className="aspect-square w-12 rounded-2xl border-white/5 hover:bg-white/5 hover:border-white/20 p-0"
                              asChild
                            >
                              <a href={`/mentors/${mentor._id}`}>
                                <ArrowUpRight className="h-5 w-5" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="h-80 border border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-12">
                <Terminal className="h-12 w-12 text-slate-700 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Nodes Found</h3>
                <p className="text-slate-500 max-w-xs">The system couldn't locate any mentors matching your current search parameters.</p>
                <Button 
                  variant="link" 
                  onClick={() => {setSearchQuery(""); setActiveCategory("All");}}
                  className="text-cyan-500 uppercase font-bold text-xs tracking-widest mt-4"
                >
                  Reset System Filter
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global CSS for scrollbar and selection */}
      <style jsx global>{`
        ::-selection {
          background: rgba(6, 182, 212, 0.2);
          color: white;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  )
}
