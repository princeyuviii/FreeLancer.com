'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Briefcase, 
  Users, 
  MessageSquare, 
  PlusCircle,
  Terminal,
  TrendingUp,
  Award,
  ArrowUpRight
} from 'lucide-react'
import { toast } from 'sonner'
import { JobPostingModal } from './job-posting-modal'
import { cn } from '@/lib/utils'

interface Application {
  _id: string
  userId: string
  jobId: {
    _id: string
    title: string
    company: string
    employerId: string
  }
  status: string
  createdAt: string
}

const MONO = "font-mono tracking-tighter text-[10px] uppercase text-slate-500";

export function EmployerDashboard() {
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchEmployerData()
  }, [])

  const fetchEmployerData = async () => {
    try {
      const res = await fetch('/api/employer/applications')
      if (res.ok) {
        const data = await res.json()
        setApplications(data)
      }
    } catch (error) {
      console.error('Error fetching employer data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateStatus = async (applicationId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (res.ok) {
        toast.success(`Application ${newStatus.toLowerCase()} successfully`, {
          style: { background: "#0a0a0a", border: "1px solid #222", color: "#e2e8f0" }
        })
        fetchEmployerData()
      }
    } catch (error) {
      toast.error('An error occurred')
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

  const stats = [
    { label: "Active Postings", value: new Set(applications.filter(a => a.jobId).map(a => a.jobId._id)).size, icon: <Briefcase className="w-4 h-4 text-cyan-500" /> },
    { label: "Total Applicants", value: applications.length, icon: <Users className="w-4 h-4 text-violet-500" /> },
    { label: "Hired Nodes", value: applications.filter(a => a.status === 'Accepted' || a.status === 'Completed').length, icon: <Award className="w-4 h-4 text-emerald-500" /> }
  ];

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center pb-6 border-b border-white/5">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Employer_Ops</h2>
          <p className={MONO}>Command center for project recruitment</p>
        </div>
        <JobPostingModal onJobPosted={fetchEmployerData} />
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-white/[0.01] border-white/5 p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:opacity-10 transition-opacity">
              <TrendingUp className="w-24 h-24" />
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
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Applicant_Buffer</h3>
            <p className={MONO}>Reviewing incoming talent nodes</p>
          </div>
          <Terminal className="w-5 h-5 text-slate-700" />
        </div>
        
        <ScrollArea className="h-[500px]">
          <div className="p-8 space-y-4">
            {applications.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-white/5 rounded-3xl">
                <p className={MONO}>No_Applicants_Detected</p>
              </div>
            ) : (
              applications.map((app) => (
                <Card key={app._id} className="bg-white/[0.02] border-white/5 hover:bg-white/[0.04] transition-all p-6 rounded-3xl relative group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-bold text-white text-lg group-hover:text-cyan-500 transition-colors uppercase tracking-tight">
                          {app.jobId?.title || "Deleted_Project"}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={MONO}>Applicant_ID: {app.userId.substring(0, 12)}</span>
                          <div className="h-1 w-1 rounded-full bg-slate-700" />
                          <span className={MONO}>Received: {new Date(app.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={cn(
                          "px-2 py-0.5 rounded-lg text-[9px] uppercase tracking-widest border",
                          app.status === 'Accepted' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                          app.status === 'Rejected' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                          "bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
                        )}>
                          {app.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMessage(app.userId)}
                        className="h-10 px-4 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 font-bold text-[10px] uppercase tracking-widest"
                      >
                        <MessageSquare className="h-3.5 w-3.5 mr-2" />
                        Chat
                      </Button>
                      {app.status === 'Pending' && (
                        <>
                          <Button
                            size="sm"
                            className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-900/20"
                            onClick={() => handleUpdateStatus(app._id, 'Accepted')}
                          >
                            <CheckCircle className="h-3.5 w-3.5 mr-2" />
                            Hire
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-10 px-4 text-slate-500 hover:text-red-400 hover:bg-red-400/5 rounded-xl font-bold text-[10px] uppercase tracking-widest"
                            onClick={() => handleUpdateStatus(app._id, 'Rejected')}
                          >
                            <XCircle className="h-3.5 w-3.5 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}
                      {app.status === 'Accepted' && (
                        <Button
                          size="sm"
                          className="h-10 px-6 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-cyan-900/20"
                          onClick={() => handleUpdateStatus(app._id, 'Completed')}
                        >
                          Mark Completed
                        </Button>
                      )}
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
