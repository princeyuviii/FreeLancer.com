'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Save, X, Terminal, Cpu, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface ProfileData {
  username: string
  role: 'Freelancer' | 'Employer' | 'Mentor'
  experience: string
  hourlyRate: number
  location: string
  skills: string[]
  githubUrl: string
  linkedinUrl: string
}

interface ProfileEditorProps {
  initialData: ProfileData
  onSave: (data: ProfileData) => void
  onCancel: () => void
}

const MONO = "font-mono tracking-tighter text-[10px] uppercase text-slate-500";

export function ProfileEditor({ initialData, onSave, onCancel }: ProfileEditorProps) {
  const [formData, setFormData] = useState<ProfileData>({
    ...initialData,
    skills: initialData.skills || []
  })
  const [isSaving, setIsSaving] = useState(false)
  const [skillInput, setSkillInput] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'number' ? Number(value) : value 
    }))
  }

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault()
      if (!formData.skills.includes(skillInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          skills: [...prev.skills, skillInput.trim()]
        }))
      }
      setSkillInput('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      // Create a clean copy of data to send
      const { _id, clerkId, createdAt, updatedAt, __v, ...cleanData } = formData as any;

      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanData)
      })

      const data = await res.json()

      if (res.ok) {
        toast.success('Identity profile successfully updated.', {
          style: { background: "#0a0a0a", border: "1px solid #222", color: "#e2e8f0" }
        })
        onSave(data)
      } else {
        const errorMsg = data.errors ? "Validation failed: Check your inputs." : "Identity update failed."
        toast.error(errorMsg, {
          style: { background: "#0a0a0a", border: "1px solid #222", color: "#f87171" }
        })
      }
    } catch (error) {
      toast.error('System transmission error.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="bg-white/[0.01] border-white/5 rounded-[2.5rem] overflow-hidden">
      <CardHeader className="p-10 border-b border-white/5">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-3xl font-black text-white uppercase tracking-tighter">Update_Identity</CardTitle>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
            <span className={cn(MONO, "text-cyan-500")}>Edit_Mode_Active</span>
          </div>
        </div>
        <CardDescription className={MONO}>Modifying core user parameters and technical stack</CardDescription>
      </CardHeader>
      <CardContent className="p-10">
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label htmlFor="username" className={MONO}>Subject_Name</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="bg-white/[0.02] border-white/10 h-14 rounded-2xl focus:border-cyan-500/50 transition-all font-mono text-xs uppercase"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="role" className={MONO}>Access_Role</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value: 'Freelancer' | 'Employer' | 'Mentor') => 
                  setFormData(prev => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger className="bg-white/[0.02] border-white/10 h-14 rounded-2xl focus:ring-0 focus:border-cyan-500/50 font-mono text-xs uppercase">
                  <SelectValue placeholder="SELECT_ROLE" />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-white/10 text-white rounded-2xl overflow-hidden">
                  <SelectItem value="Freelancer" className="focus:bg-white/5 focus:text-cyan-400 font-mono text-xs uppercase cursor-pointer">Student_Node</SelectItem>
                  <SelectItem value="Employer" className="focus:bg-white/5 focus:text-cyan-400 font-mono text-xs uppercase cursor-pointer">Project_Owner</SelectItem>
                  <SelectItem value="Mentor" className="focus:bg-white/5 focus:text-cyan-400 font-mono text-xs uppercase cursor-pointer">Expert_Node</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label htmlFor="experience" className={MONO}>XP_Level</Label>
              <Input
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="E.G. INTERMEDIATE"
                className="bg-white/[0.02] border-white/10 h-14 rounded-2xl focus:border-cyan-500/50 transition-all font-mono text-xs uppercase"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="hourlyRate" className={MONO}>Compensation_Rate (₹)</Label>
              <Input
                id="hourlyRate"
                name="hourlyRate"
                type="number"
                value={formData.hourlyRate}
                onChange={handleInputChange}
                className="bg-white/[0.02] border-white/10 h-14 rounded-2xl focus:border-cyan-500/50 transition-all font-mono text-xs uppercase"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="location" className={MONO}>Geographic_Node</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="bg-white/[0.02] border-white/10 h-14 rounded-2xl focus:border-cyan-500/50 transition-all font-mono text-xs uppercase"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className={MONO}>Technical_Stack (Input + Enter)</Label>
            <div className="relative group">
              <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-700 group-focus-within:text-cyan-500 transition-colors" />
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="E.G. REACT_SYSTEMS, PYTHON_BACKEND..."
                className="bg-white/[0.02] border-white/10 h-14 pl-12 rounded-2xl focus:border-cyan-500/50 transition-all font-mono text-xs uppercase"
              />
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {formData.skills.map((skill) => (
                <div
                  key={skill}
                  className="bg-cyan-500/5 text-cyan-500 border border-cyan-500/10 px-4 py-2 rounded-xl text-[10px] font-mono flex items-center gap-3 group/skill uppercase tracking-widest"
                >
                  {skill}
                  <X
                    className="h-3 w-3 cursor-pointer opacity-40 group-hover/skill:opacity-100 hover:text-red-400 transition-all"
                    onClick={() => removeSkill(skill)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label htmlFor="githubUrl" className={MONO}>Source_Repository (GitHub)</Label>
              <Input
                id="githubUrl"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleInputChange}
                className="bg-white/[0.02] border-white/10 h-14 rounded-2xl focus:border-cyan-500/50 transition-all font-mono text-xs"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="linkedinUrl" className={MONO}>Network_Uplink (LinkedIn)</Label>
              <Input
                id="linkedinUrl"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleInputChange}
                className="bg-white/[0.02] border-white/10 h-14 rounded-2xl focus:border-cyan-500/50 transition-all font-mono text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <Button type="button" variant="ghost" onClick={onCancel} className="h-14 px-8 rounded-2xl font-bold uppercase tracking-widest text-[10px] text-slate-500 hover:text-white">
              Cancel_Abort
            </Button>
            <Button type="submit" disabled={isSaving} className="h-14 px-10 bg-white text-black hover:bg-slate-200 rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-2xl">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-3" /> : <Save className="h-4 w-4 mr-3" />}
              Commit_Identity_Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
