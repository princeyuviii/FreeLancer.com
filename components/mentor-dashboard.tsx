'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Loader2, 
  Calendar, 
  DollarSign, 
  UserCheck, 
  MessageSquare,
  Terminal,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Cpu
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Booking {
  _id: string
  studentId: string
  date: string
  status: string
  paymentStatus: string
  topic: string
}

const MONO = "font-mono tracking-tighter text-[10px] uppercase text-slate-500";

export function MentorDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchMentorData()
  }, [])

  const fetchMentorData = async () => {
    try {
      const res = await fetch('/api/mentor/bookings')
      if (res.ok) {
        const data = await res.json()
        setBookings(data)
      }
    } catch (error) {
      console.error('Error fetching mentor data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMessage = async (participantId: string) => {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId }),
      });

      if (res.ok) {
        window.location.href = "/dashboard?tab=messages";
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    )
  }

  const totalEarnings = bookings.filter(b => b.paymentStatus === 'Paid').length * 800 // Placeholder rate
  
  const stats = [
    { label: "Total Sessions", value: bookings.length, icon: <Calendar className="w-4 h-4 text-violet-500" /> },
    { label: "Total Earnings", value: `₹${totalEarnings}`, icon: <DollarSign className="w-4 h-4 text-emerald-500" /> },
    { label: "Active Nodes", value: new Set(bookings.map(b => b.studentId)).size, icon: <UserCheck className="w-4 h-4 text-cyan-500" /> }
  ];

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center pb-6 border-b border-white/5">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Mentor_Ops</h2>
          <p className={MONO}>Managing mentorship pipelines and sessions</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
          <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest">Active_Service</span>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-white/[0.01] border-white/5 p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:opacity-10 transition-opacity text-white">
              <Cpu className="w-24 h-24" />
            </div>
            <div className="flex flex-row items-center justify-between pb-4">
              <p className={MONO}>{stat.label}</p>
              {stat.icon}
            </div>
            <div className="text-3xl font-black text-white">{stat.value}</div>
          </Card>
        ))}
      </div>

      <Card className="bg-white/[0.01] border-white/5 rounded-[2.5rem] overflow-hidden">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Session_Buffer</h3>
            <p className={MONO}>Upcoming mentorship transmissions</p>
          </div>
          <Clock className="w-5 h-5 text-slate-700" />
        </div>
        
        <ScrollArea className="h-[500px]">
          <div className="p-8 space-y-4">
            {bookings.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-white/5 rounded-3xl">
                <p className={MONO}>No_Sessions_Detected</p>
              </div>
            ) : (
              bookings.map((booking) => (
                <Card key={booking._id} className="bg-white/[0.02] border-white/5 hover:bg-white/[0.04] transition-all p-6 rounded-3xl group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="bg-white/5 p-4 rounded-2xl group-hover:bg-cyan-500/10 transition-all border border-transparent group-hover:border-cyan-500/20">
                        <Calendar className="h-6 w-6 text-slate-500 group-hover:text-cyan-500 transition-colors" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg uppercase tracking-tight">{booking.topic || 'General_Session'}</h4>
                        <p className={MONO}>
                          {new Date(booking.date).toLocaleDateString('en-US', { 
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                          })}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge className={cn(
                            "px-2 py-0.5 rounded-lg text-[9px] uppercase tracking-widest border",
                            booking.paymentStatus === 'Paid' 
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                              : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          )}>
                            {booking.paymentStatus}
                          </Badge>
                          <Badge variant="outline" className="border-white/5 text-slate-600 font-mono text-[9px] uppercase">
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMessage(booking.studentId)}
                        className="h-10 px-4 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 font-bold text-[10px] uppercase tracking-widest"
                      >
                        <MessageSquare className="h-3.5 w-3.5 mr-2" />
                        Chat
                      </Button>
                      <Button
                        size="sm"
                        className="h-10 px-6 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-violet-900/20"
                        onClick={() => toast.info('Link activation scheduled 5 mins before session', {
                          style: { background: "#0a0a0a", border: "1px solid #222", color: "#e2e8f0" }
                        })}
                      >
                        Join Session
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  )
}
