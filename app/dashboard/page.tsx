"use client";

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useClerk, useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User as UserIcon, 
  Briefcase, 
  MessageSquare, 
  Settings, 
  LogOut, 
  ChevronRight, 
  LayoutDashboard,
  ShieldCheck,
  TrendingUp,
  Award,
  Loader2,
  Bell,
  Cpu,
  Terminal,
  ArrowUpRight,
  Plus,
  ExternalLink,
  Download,
  Wallet
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

// Section Components
import { ChatInterface } from '@/components/chat-interface';
import { ProfileEditor } from '@/components/profile-editor';
import { EmployerDashboard } from '@/components/employer-dashboard';
import { MentorDashboard } from '@/components/mentor-dashboard';
import { Badge } from '@/components/ui/badge';

const MONO_CLASS = "font-mono tracking-tighter text-[10px] uppercase";

function DashboardContent() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [activeSection, setActiveSection] = useState('profile');
  const [profile, setProfile] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [profRes, appsRes] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/applications')
      ]);
      
      if (profRes.ok) setProfile(await profRes.json());
      if (appsRes.ok) setApplications(await appsRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveSection(tab);
    fetchData();
  }, [searchParams, fetchData]);

  const setSection = (section: string) => {
    setActiveSection(section);
    router.push(`/dashboard?tab=${section}`, { scroll: false });
  };

  const handleSignOut = async () => {
    toast.info("Terminating session nodes...", {
      style: { background: "#0a0a0a", border: "1px solid #222", color: "#e2e8f0" }
    });
    await signOut();
    router.push('/');
  };

  const handleWithdraw = async () => {
    if (!profile?.escrowBalance || profile.escrowBalance <= 0) {
      toast.error("Withdrawal Restricted", {
        description: "Minimum threshold of ₹1,000 not met for this node.",
        style: { background: "#0a0a0a", border: "1px solid #222", color: "#e2e8f0" }
      });
      return;
    }

    try {
      const res = await fetch('/api/withdraw', { method: 'POST' });
      const data = await res.json();

      if (res.ok) {
        toast.success("Withdrawal Initialized", {
          description: data.message,
          style: { background: "#0a0a0a", border: "1px solid #222", color: "#10b981" }
        });
        setProfile((prev: any) => ({ ...prev, escrowBalance: 0 }));
      } else {
        toast.error(data.error || "Withdrawal failed");
      }
    } catch (err) {
      toast.error("Transmission error during withdrawal.");
    }
  };

  const handleDownloadReport = () => {
    try {
      const reportContent = `
FREE_LANCER TECHNICAL REPORT
============================
IDENTITY: ${profile?.username}
ROLE: ${profile?.role}
XP_LEVEL: ${profile?.experience}
TECHNICAL_STACK: ${profile?.skills?.join(', ') || 'N/A'}
LOCATION: ${profile?.location}
GENERATED_ON: ${new Date().toLocaleString()}
STATUS: VERIFIED_NODE
============================
      `.trim();

      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${profile?.username || 'user'}_tech_report.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Report Decrypted", {
        description: "Technical_Summary_v1.0.txt is now in your local storage.",
        style: { background: "#0a0a0a", border: "1px solid #222", color: "#e2e8f0" }
      });
    } catch (err) {
      toast.error("Failed to generate report.");
    }
  };

  const navItems = [
    { id: 'profile', label: 'Identity_Profile', icon: <UserIcon className="w-4 h-4" /> },
    { id: 'jobs', label: 'Active_Applications', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'messages', label: 'Secure_Messages', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  if (profile?.role === 'Employer') {
    navItems.push({ id: 'employer', label: 'Employer_Portal', icon: <ShieldCheck className="w-4 h-4" /> });
  }
  if (profile?.role === 'Mentor') {
    navItems.push({ id: 'mentor', label: 'Mentor_Portal', icon: <Award className="w-4 h-4" /> });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-cyan-500" />
          <span className={cn(MONO_CLASS, "text-slate-500")}>Decrypting_User_Buffer...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-slate-300 font-sans selection:bg-cyan-500/30 overflow-hidden flex">
      {/* ── Dashboard Sidebar ── */}
      <aside className="w-72 border-r border-white/5 bg-white/[0.01] flex flex-col z-20">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-8 w-1 bg-cyan-500" />
            <span className={cn(MONO_CLASS, "text-cyan-500")}>Control_Panel_V2</span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all group",
                  activeSection === item.id 
                    ? "bg-cyan-500/10 text-cyan-500 border border-cyan-500/20" 
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className={cn(MONO_CLASS, "text-[11px] font-bold")}>{item.label}</span>
                </div>
                <ChevronRight className={cn(
                  "w-3 h-3 opacity-0 group-hover:opacity-100 transition-all",
                  activeSection === item.id && "opacity-100"
                )} />
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-white/5 space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10 border border-white/10 ring-2 ring-cyan-500/20">
              <AvatarImage src={profile?.image} />
              <AvatarFallback className="bg-white/5 text-slate-500 font-bold uppercase">
                {profile?.username?.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{profile?.username}</p>
              <p className={cn(MONO_CLASS, "text-[8px] text-slate-600")}>{profile?.role || "Freelancer"}</p>
            </div>
          </div>
          <Button 
            onClick={handleSignOut}
            variant="ghost" 
            className="w-full justify-start gap-3 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-400/5 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className={cn(MONO_CLASS)}>Terminate_Session</span>
          </Button>
        </div>
      </aside>

      {/* ── Main Dashboard Content ── */}
      <main className="flex-1 overflow-y-auto relative custom-scrollbar">
        {/* Top Activity Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-10 py-6 bg-black/80 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-tighter">
              {activeSection === 'profile' && "Identity_System"}
              {activeSection === 'jobs' && "Task_Buffer"}
              {activeSection === 'messages' && "Communication_Link"}
              {activeSection === 'employer' && "Employer_Management"}
              {activeSection === 'mentor' && "Mentorship_Ops"}
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className={cn(MONO_CLASS, "text-emerald-500")}>Node_Online</span>
            </div>
            <button 
              onClick={() => toast.info("Zero pending alerts in current buffer.", { style: { background: "#0a0a0a", border: "1px solid #222", color: "#e2e8f0" }})}
              className="relative p-2 text-slate-500 hover:text-white transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-cyan-500 rounded-full border-2 border-black" />
            </button>
          </div>
        </div>

        <div className="p-10 max-w-6xl mx-auto pb-32">
          <AnimatePresence mode="wait">
            {activeSection === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {isEditingProfile ? (
                  <ProfileEditor
                    initialData={profile}
                    onSave={(updatedData) => {
                      setProfile(updatedData)
                      setIsEditingProfile(false)
                    }}
                    onCancel={() => setIsEditingProfile(false)}
                  />
                ) : (
                  <div className="space-y-8">
                    {/* Hero Profile Card */}
                    <Card className="bg-white/[0.01] border-white/5 rounded-[2.5rem] p-10 overflow-hidden relative">
                      <div className="absolute top-0 right-0 p-10 opacity-10">
                        <Cpu className="w-32 h-32 text-cyan-500" />
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-10 relative z-10">
                        <Avatar className="h-32 w-32 border-2 border-white/10 rounded-3xl">
                          <AvatarImage src={profile?.image} />
                          <AvatarFallback className="bg-white/5 text-slate-500 text-2xl font-bold uppercase">
                            {profile?.username?.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 space-y-6">
                          <div className="space-y-2">
                            <h3 className="text-4xl font-black tracking-tighter text-white uppercase">{profile?.username || "Identity_Unknown"}</h3>
                            <div className="flex flex-wrap gap-3">
                              <Badge variant="outline" className="border-cyan-500/30 text-cyan-500 bg-cyan-500/5 px-3 py-1 font-mono text-[9px] uppercase tracking-widest rounded-lg">
                                {profile?.role || "Freelancer"}
                              </Badge>
                              <Badge variant="outline" className="border-white/10 text-slate-500 px-3 py-1 font-mono text-[9px] uppercase tracking-widest rounded-lg">
                                {profile?.location || "Remote_Node"}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-white/5">
                            <div>
                              <p className={cn(MONO_CLASS, "text-slate-600 mb-1")}>Rate</p>
                              <p className="text-white font-bold">₹{profile?.hourlyRate || '0'}/hr</p>
                            </div>
                            <div>
                              <p className={cn(MONO_CLASS, "text-slate-600 mb-1")}>XP_Level</p>
                              <p className="text-white font-bold">{profile?.experience || 'Beginner'}</p>
                            </div>
                            <div>
                              <p className={cn(MONO_CLASS, "text-slate-600 mb-1")}>Escrow</p>
                              <p className="text-cyan-500 font-bold">₹{profile?.escrowBalance || '0'}</p>
                            </div>
                            <div>
                              <p className={cn(MONO_CLASS, "text-slate-600 mb-1")}>Uptime</p>
                              <p className="text-white font-bold">99.8%</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-4 pt-4">
                            <Button onClick={() => setIsEditingProfile(true)} className="bg-white text-black hover:bg-slate-200 rounded-xl px-8 h-12 font-bold uppercase tracking-widest text-[10px]">
                              Update_Identity
                            </Button>
                            <Button onClick={handleDownloadReport} variant="outline" className="border-white/10 hover:bg-white/5 rounded-xl px-8 h-12 font-bold uppercase tracking-widest text-[10px] gap-2">
                              <Download className="w-3.5 h-3.5" />
                              Technical_Report
                            </Button>
                            <Button onClick={handleWithdraw} variant="ghost" className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-400/5 rounded-xl px-8 h-12 font-bold uppercase tracking-widest text-[10px] gap-2">
                              <Wallet className="w-3.5 h-3.5" />
                              Withdraw_Funds
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Skills Node */}
                      <Card className="bg-white/[0.01] border-white/5 rounded-[2rem] p-8 space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className={cn(MONO_CLASS, "text-slate-500")}>Technical_Stack</h4>
                          <Terminal className="w-4 h-4 text-cyan-500/50" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {profile?.skills?.map((skill: string) => (
                            <div key={skill} className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 text-slate-400 text-[11px] font-mono">
                              {skill}
                            </div>
                          )) || <p className="text-slate-700 text-xs italic">No components detected.</p>}
                        </div>
                      </Card>

                      {/* Achievements Node */}
                      <Card className="bg-white/[0.01] border-white/5 rounded-[2rem] p-8 space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className={cn(MONO_CLASS, "text-slate-500")}>Achievement_Buffer</h4>
                          <Award className="w-4 h-4 text-emerald-500/50" />
                        </div>
                        <ul className="space-y-3">
                          {[
                            "System Initialized: 2024",
                            "First Task Decrypted",
                            "High-Value Node Connected"
                          ].map((ach, i) => (
                            <li key={i} className="flex items-center gap-3 text-xs text-slate-400 uppercase tracking-widest">
                              <TrendingUp className="w-3 h-3 text-emerald-500" />
                              {ach}
                            </li>
                          ))}
                        </ul>
                      </Card>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeSection === 'jobs' && (
              <motion.div
                key="jobs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h3 className={cn(MONO_CLASS, "text-slate-500")}>Tracked_Project_Nodes</h3>
                  <Button onClick={() => router.push('/jobs')} size="sm" className="bg-cyan-500 hover:bg-cyan-600 text-black rounded-xl font-bold text-[10px] uppercase tracking-widest px-6 h-10 gap-2 shadow-lg shadow-cyan-900/20">
                    <Plus className="w-3.5 h-3.5" />
                    Find_More_Jobs
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {applications.length === 0 ? (
                    <div className="col-span-full py-40 text-center border border-dashed border-white/5 rounded-[3rem]">
                      <p className={cn(MONO_CLASS, "text-slate-700")}>Application_Buffer_Empty</p>
                    </div>
                  ) : (
                    applications.map((app, i) => (
                      <Card key={app._id} className="group bg-white/[0.01] border-white/5 hover:bg-white/[0.03] hover:border-white/10 transition-all p-6 rounded-3xl relative overflow-hidden cursor-pointer" onClick={() => toast.info(`Accessing logs for node: ${app.jobId?.title || 'Unknown'}`, { style: { background: "#0a0a0a", border: "1px solid #222", color: "#e2e8f0" } })}>
                        <div className="absolute top-0 right-0 p-4">
                          <ExternalLink className="w-4 h-4 text-slate-700 group-hover:text-cyan-500 transition-colors" />
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <h4 className="font-bold text-white text-sm truncate uppercase tracking-tighter">
                              {app.jobId?.title || 'Unknown_Node'}
                            </h4>
                            <p className={cn(MONO_CLASS, "text-[9px] text-slate-600")}>
                              {app.jobId?.company || 'External_Buffer'}
                            </p>
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <Badge className={cn(
                              "px-2 py-0.5 rounded-lg text-[9px] uppercase tracking-widest border",
                              app.status === 'Accepted' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                              app.status === 'Rejected' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                              "bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
                            )}>
                              {app.status}
                            </Badge>
                            <span className={cn(MONO_CLASS, "text-slate-700")}>
                              {new Date(app.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {activeSection === 'messages' && (
              <motion.div
                key="messages"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="h-[calc(100vh-180px)]"
              >
                <Card className="h-full bg-white/[0.01] border-white/5 rounded-[2.5rem] overflow-hidden">
                  <ChatInterface />
                </Card>
              </motion.div>
            )}

            {activeSection === 'employer' && (
              <motion.div
                key="employer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <EmployerDashboard />
              </motion.div>
            )}

            {activeSection === 'mentor' && (
              <motion.div
                key="mentor"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <MentorDashboard />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-cyan-500" />
          <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Initializing Dashboard...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}