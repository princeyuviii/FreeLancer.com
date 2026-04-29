"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MentorPaymentModal } from "@/components/mentor-payment-modal";
import { 
  Star, 
  MessageSquare, 
  Calendar as CalendarIcon, 
  MapPin, 
  Globe, 
  Loader2, 
  ChevronLeft, 
  ShieldCheck, 
  ArrowUpRight,
  Clock,
  Zap,
  Terminal,
  Cpu
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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

export default function MentorProfilePage() {
  const { id } = useParams();
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [mentor, setMentor] = useState<MentorData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isBooking, setIsBooking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitializingChat, setIsInitializingChat] = useState(false);

  useEffect(() => {
    fetch(`/api/mentors/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setMentor(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [id]);

  const handleBookSession = async () => {
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    setIsBooking(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mentorId: id,
          date: selectedDate,
          topic: "General Mentorship",
          paymentStatus: "Paid"
        })
      });

      if (res.ok) {
        toast.success("Session booked successfully! Check your email for details.");
        router.push("/dashboard?tab=profile");
      } else {
        toast.error("Failed to book session");
      }
    } catch (error) {
      toast.error("An error occurred while booking");
    } finally {
      setIsBooking(false);
    }
  };

  const handleMessage = async () => {
    if (!mentor) return;
    
    if (!isSignedIn) {
      toast.error("Authentication Required", {
        description: "Please sign in to start a conversation with mentors.",
        style: { background: "#0a0a0a", border: "1px solid #222", color: "#e2e8f0" },
      });
      return;
    }

    if (user?.id === mentor.clerkId) {
      toast.error("System Error", {
        description: "You cannot initiate a chat with yourself.",
        style: { background: "#0a0a0a", border: "1px solid #222", color: "#e2e8f0" },
      });
      return;
    }

    setIsInitializingChat(true);

    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId: mentor.clerkId }),
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
      setIsInitializingChat(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-cyan-500" />
          <span className={MONO_CLASS}>Initializing Node Data...</span>
        </div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-center p-8">
        <Terminal className="h-12 w-12 text-slate-700 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Node Not Found</h3>
        <p className="text-slate-500 max-w-xs">The requested mentor node is no longer accessible in the database.</p>
        <Button 
          variant="link" 
          onClick={() => router.push("/mentors")}
          className="text-cyan-500 uppercase font-bold text-xs tracking-widest mt-4"
        >
          Return to Directory
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-slate-300 selection:bg-cyan-500/30 overflow-x-hidden font-sans pb-24">
      {/* Abstract Background Noise/Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 z-0" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,_rgba(30,30,30,1)_0%,_rgba(0,0,0,1)_100%)] z-0" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.button 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push("/mentors")}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-12 group"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className={MONO_CLASS}>Back to Directory</span>
        </motion.button>

        <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">
          {/* Main Content */}
          <div className="space-y-12">
            {/* Header Section */}
            <section className="flex flex-col md:flex-row gap-8 items-start md:items-center p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
              <div className="relative">
                <img 
                  src={mentor.image} 
                  alt={mentor.name}
                  className="w-32 h-32 rounded-[2.5rem] object-cover border border-white/10"
                />
                <div className="absolute -bottom-2 -right-2 bg-black border border-white/10 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xl">
                  <Star className="h-4 w-4 text-cyan-400 fill-cyan-400" />
                  <span className={cn(MONO_CLASS, "text-[11px] text-white")}>{mentor.rating}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tighter">{mentor.name}</h1>
                  <p className="text-xl text-cyan-400 font-medium">{mentor.expertise}</p>
                </div>
                
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                    <MapPin className="h-4 w-4 text-slate-600" />
                    {mentor.country}
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                    <Globe className="h-4 w-4 text-slate-600" />
                    English, Hindi
                  </div>
                  <div className="flex items-center gap-2 text-emerald-500 text-sm font-bold uppercase tracking-tighter">
                    <ShieldCheck className="h-4 w-4" />
                    Verified Expert
                  </div>
                </div>
              </div>
            </section>

            {/* Specialties & Experience */}
            <section className="grid md:grid-cols-2 gap-8">
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-6">
                <h3 className={cn(MONO_CLASS, "text-slate-600")}>Core_Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {mentor.specialties.map((s) => (
                    <span key={s} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-xs text-white font-bold uppercase tracking-tighter">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-6">
                <h3 className={cn(MONO_CLASS, "text-slate-600")}>System_Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Sessions</p>
                    <p className="text-xl font-bold text-white">120+</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Resp. Time</p>
                    <p className="text-xl font-bold text-white">~4h</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Biography */}
            <section className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5">
                  <Cpu className="h-5 w-5 text-cyan-500" />
                </div>
                <h3 className={cn(MONO_CLASS, "text-white")}>Professional_Audit</h3>
              </div>
              <p className="text-slate-400 leading-relaxed text-lg italic font-light">
                "Experienced professional with a passion for mentoring students and early-career developers. 
                I specialize in {mentor.expertise} and have helped over 50+ students land their dream roles 
                in top tech companies. Let's connect to build your roadmap!"
              </p>
            </section>
          </div>

          {/* Booking Sidebar */}
          <aside className="sticky top-24 space-y-8">
            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <div className="bg-white/[0.05] p-6 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <span className={cn(MONO_CLASS, "text-white")}>Booking_Initialize</span>
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active</span>
                  </div>
                </div>
              </div>
              
              <div className="p-8 space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className={cn(MONO_CLASS, "text-slate-600 mb-1")}>Rate_Per_Session</p>
                      <span className="text-4xl font-bold text-white">₹{mentor.hourlyRate}</span>
                    </div>
                    <div className="text-right">
                      <p className={cn(MONO_CLASS, "text-slate-600 mb-1")}>Duration</p>
                      <span className="text-lg font-bold text-white">60 Min</span>
                    </div>
                  </div>

                  <div className="pt-6">
                    <p className={cn(MONO_CLASS, "text-slate-600 mb-4")}>Select_Node_Availability</p>
                    <div className="flex justify-center bg-black/50 rounded-2xl p-2 border border-white/5">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border-0 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <Clock className="h-5 w-5 text-cyan-500" />
                    <div>
                      <p className={cn(MONO_CLASS, "text-slate-500 mb-0.5")}>Status</p>
                      <p className="text-sm font-bold text-white">{mentor.availability}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <MentorPaymentModal
                      mentorName={mentor.name}
                      amount={mentor.hourlyRate}
                      onSuccess={handleBookSession}
                    />
                    <Button 
                      onClick={handleMessage}
                      disabled={isInitializingChat}
                      variant="outline" 
                      className="w-full border-white/5 hover:bg-white/5 h-14 rounded-2xl font-bold text-slate-400 hover:text-white disabled:opacity-50"
                    >
                      {isInitializingChat ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <MessageSquare className="h-4 w-4 mr-2" />
                      )}
                      {isInitializingChat ? "Connecting..." : "Initialize Chat"}
                    </Button>
                  </div>
                </div>

                <p className="text-[10px] text-center text-slate-600 uppercase tracking-widest font-bold">
                  <Zap className="h-3 w-3 inline mr-1 text-cyan-500 fill-cyan-500" />
                  Secure Node Encryption Active
                </p>
              </div>
            </div>

            <div className="p-6 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl flex items-start gap-4">
              <ShieldCheck className="h-6 w-6 text-cyan-400 shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-white uppercase tracking-tighter">Escrow Protection</p>
                <p className="text-xs text-cyan-400/60 leading-relaxed">
                  Funds are held securely and only released after your session is completed.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style jsx global>{`
        .rdp-cell {
          color: #94a3b8;
        }
        .rdp-day_selected {
          background-color: white !important;
          color: black !important;
          font-weight: bold;
          border-radius: 8px;
        }
        .rdp-button:hover:not(.rdp-day_selected) {
          background-color: rgba(255, 255, 255, 0.05) !important;
        }
      `}</style>
    </div>
  );
}
