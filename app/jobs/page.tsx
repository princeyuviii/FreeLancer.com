"use client";

import { useState, useEffect, useMemo } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Clock, 
  Briefcase, 
  MapPin, 
  IndianRupee, 
  Loader2, 
  CheckCircle, 
  Sparkles, 
  MessageSquare, 
  Rocket,
  Search,
  Filter,
  ShieldCheck,
  Zap,
  Globe,
  Terminal,
  ArrowUpRight,
  TrendingUp,
  Award
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface JobData {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
  description: string;
  skills: string[];
  level: string;
  category: string;
  employerId: string;
}

const MONO_CLASS = "font-mono tracking-tighter text-[10px] uppercase";

export default function JobsPage() {
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [jobs, setJobs] = useState<JobData[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isInitializingChat, setIsInitializingChat] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeLevel, setActiveLevel] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          fetch("/api/jobs"),
          fetch("/api/applications")
        ]);

        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          setJobs(jobsData);
        }

        if (appsRes.ok) {
          const appsData = await appsRes.json();
          const appliedIds = appsData
            .filter((app: any) => app.jobId)
            .map((app: any) => app.jobId._id || app.jobId);
          setAppliedJobs(appliedIds);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = activeCategory === "All" || job.category === activeCategory;
      const matchesLevel = activeLevel === "All" || job.level === activeLevel;

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [jobs, searchQuery, activeCategory, activeLevel]);

  const handleApply = async (jobId: string, jobTitle: string, company: string) => {
    if (!isSignedIn) {
      toast.error("Authentication Required", {
        description: "Please sign in to apply for this position.",
        style: { background: "#0a0a0a", border: "1px solid #222", color: "#e2e8f0" },
      });
      return;
    }

    setLoadingId(jobId);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      
      if (!res.ok) throw new Error("Failed to apply");

      setAppliedJobs(prev => [...prev, jobId]);

      // Success Notification
      toast.success("Application Transmitted", {
        description: `Successfully applied for ${jobTitle} at ${company}.`,
        style: { background: "#0a0a0a", border: "1px solid #222", color: "#e2e8f0" },
      });

      // Background email notification
      if (user?.primaryEmailAddress?.emailAddress) {
        fetch("/api/send-application", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.primaryEmailAddress.emailAddress,
            jobTitle,
            company,
          }),
        }).catch(console.error);
      }
    } catch (error) {
      toast.error("Transmission Error", {
        description: "Unable to submit application at this time.",
        style: { background: "#0a0a0a", border: "1px solid #222", color: "#e2e8f0" },
      });
    } finally {
      setLoadingId(null);
    }
  };

  const handleMessage = async (employerId: string) => {
    if (!isSignedIn) {
      toast.error("Authentication Required", {
        description: "Please sign in to message employers.",
        style: { background: "#0a0a0a", border: "1px solid #222", color: "#e2e8f0" },
      });
      return;
    }

    setIsInitializingChat(employerId);
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId: employerId }),
      });

      if (res.ok) {
        toast.success("Connection Established", {
          description: "Redirecting to secure chat channel...",
          style: { background: "#0a0a0a", border: "1px solid #222", color: "#e2e8f0" },
        });
        router.push("/dashboard?tab=messages");
      }
    } catch (error) {
      toast.error("Uplink Failed", {
        description: "Unable to establish secure chat link.",
        style: { background: "#0a0a0a", border: "1px solid #222", color: "#e2e8f0" },
      });
    } finally {
      setIsInitializingChat(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
          <span className={MONO_CLASS}>Scanning Job_Buffer...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-slate-300 selection:bg-emerald-500/30 overflow-x-hidden font-sans">
      {/* Background Polish */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_-20%,_rgba(16,185,129,0.1)_0%,_rgba(0,0,0,1)_100%)] z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Technical Header */}
        <header className="py-20 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 mb-12">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="h-1 w-8 bg-emerald-500" />
              <span className={cn(MONO_CLASS, "text-emerald-500")}>System / Job_Board_Active</span>
            </motion.div>
            <h1 className="text-6xl font-black tracking-tighter text-white">
              DISCOVER <span className="text-emerald-500 italic">OPPS</span>
            </h1>
            <p className="text-slate-500 max-w-xl text-sm leading-relaxed uppercase tracking-widest font-medium">
              High-fidelity freelance nodes for student developers. 
              <span className="text-slate-700 block mt-1">Status: Fully Operational // 128 New Projects Available</span>
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
              <Input 
                placeholder="SEARCH_BY_TECH_OR_COMPANY..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/[0.02] border-white/10 w-full md:w-80 h-14 pl-12 rounded-2xl font-mono text-xs focus:border-emerald-500/50 transition-all placeholder:text-slate-800"
              />
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-[280px_1fr] gap-12 pb-20">
          {/* Filter Sidebar */}
          <aside className="space-y-10">
            <div>
              <h3 className={cn(MONO_CLASS, "mb-6 text-slate-500")}>Node_Categories</h3>
              <div className="space-y-2">
                {["All", "Development", "Data", "Design"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-xl transition-all font-mono text-xs uppercase tracking-widest",
                      activeCategory === cat 
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                        : "text-slate-600 hover:text-slate-400 hover:bg-white/5"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className={cn(MONO_CLASS, "mb-6 text-slate-500")}>Technical_Level</h3>
              <div className="space-y-2">
                {["All", "Entry Level", "Intermediate", "Expert"].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setActiveLevel(lvl)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-xl transition-all font-mono text-xs uppercase tracking-widest",
                      activeLevel === lvl 
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                        : "text-slate-600 hover:text-slate-400 hover:bg-white/5"
                    )}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <Card className="bg-emerald-500/5 border-emerald-500/10 p-6 rounded-3xl">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <span className={cn(MONO_CLASS, "text-emerald-500")}>Platform_Trust</span>
              </div>
              <p className="text-[11px] text-emerald-500/60 leading-relaxed uppercase tracking-tighter">
                Every job listed on this buffer is vetted. All payments are secured via our Smart_Escrow nodes.
              </p>
            </Card>
          </aside>

          {/* Job List */}
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredJobs.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-40 text-center border border-dashed border-white/5 rounded-[3rem]"
                >
                  <p className={cn(MONO_CLASS, "text-slate-700")}>No_Matching_Jobs_Found_In_Buffer</p>
                  <Button 
                    variant="ghost" 
                    onClick={() => { setSearchQuery(""); setActiveCategory("All"); setActiveLevel("All"); }}
                    className="mt-4 text-emerald-500 font-mono text-[10px] uppercase tracking-widest"
                  >
                    Reset_Search_Parameters
                  </Button>
                </motion.div>
              ) : (
                filteredJobs.map((job, idx) => (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    layout
                  >
                    <Card className="group bg-white/[0.01] border-white/5 hover:bg-white/[0.03] hover:border-white/10 transition-all duration-500 p-8 rounded-[2.5rem] relative overflow-hidden">
                      {/* Hover Accent */}
                      <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowUpRight className="h-6 w-6 text-emerald-500/30" />
                      </div>

                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1 space-y-6">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <span className={cn(MONO_CLASS, "text-emerald-500/50")}>{job.category}</span>
                              <div className="h-px w-8 bg-white/5" />
                              <span className={cn(MONO_CLASS, "text-slate-600")}>{job.posted}</span>
                            </div>
                            <h2 className="text-3xl font-bold text-white group-hover:text-emerald-500 transition-colors">
                              {job.title}
                            </h2>
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 font-bold">{job.company}</span>
                              <div className="h-1 w-1 rounded-full bg-slate-700" />
                              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                <ShieldCheck className="h-3 w-3 text-emerald-500" />
                                <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Verified</span>
                              </div>
                            </div>
                          </div>

                          <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
                            {job.description}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill) => (
                              <Badge 
                                key={skill}
                                variant="secondary"
                                className="bg-white/[0.03] border-white/5 text-slate-400 font-mono text-[9px] uppercase tracking-widest px-3"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Action Box */}
                        <div className="md:w-64 shrink-0 flex flex-col justify-between gap-6">
                          <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl space-y-4">
                            <div className="flex items-center justify-between">
                              <span className={cn(MONO_CLASS, "text-slate-600")}>Budget</span>
                              <span className="text-white font-bold">{job.salary}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className={cn(MONO_CLASS, "text-slate-600")}>Node</span>
                              <span className="text-white font-bold">{job.type}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className={cn(MONO_CLASS, "text-slate-600")}>Level</span>
                              <span className="text-white font-bold">{job.level}</span>
                            </div>
                            <div className="pt-2 flex items-center justify-between border-t border-white/5">
                              <span className={cn(MONO_CLASS, "text-emerald-500/50")}>AI Match</span>
                              <span className="text-emerald-500 font-bold">{Math.floor(Math.random() * 20 + 80)}%</span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-3">
                            <Button
                              onClick={() => handleApply(job._id, job.title, job.company)}
                              disabled={appliedJobs.includes(job._id) || loadingId === job._id}
                              className={cn(
                                "w-full h-14 rounded-2xl font-bold transition-all duration-300 shadow-2xl",
                                appliedJobs.includes(job._id)
                                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500"
                                  : "bg-white text-black hover:bg-slate-200"
                              )}
                            >
                              {loadingId === job._id ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : appliedJobs.includes(job._id) ? (
                                <CheckCircle className="h-4 w-4 mr-2" />
                              ) : (
                                <Rocket className="h-4 w-4 mr-2" />
                              )}
                              {appliedJobs.includes(job._id) ? "Applied" : "Initialize Application"}
                            </Button>
                            <Button
                              variant="outline"
                              disabled={isInitializingChat === job.employerId}
                              onClick={() => handleMessage(job.employerId)}
                              className="w-full h-14 border-white/5 hover:bg-white/5 rounded-2xl font-bold text-slate-500 hover:text-white"
                            >
                              {isInitializingChat === job.employerId ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : (
                                <MessageSquare className="h-4 w-4 mr-2" />
                              )}
                              Contact Employer
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}