'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { PlusCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function JobPostingModal({ onJobPosted }: { onJobPosted: () => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    salary: '',
    skills: '',
    type: 'Freelance',
    category: 'Development',
    location: 'Remote',
    level: 'Entry Level'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          skills: formData.skills.split(',').map(s => s.trim())
        })
      })

      if (res.ok) {
        toast.success('Job posted successfully!')
        setIsOpen(false)
        setFormData({ title: '', company: '', description: '', salary: '', skills: '', type: 'Freelance', category: 'Development', location: 'Remote', level: 'Entry Level' })
        onJobPosted()
      } else {
        const errors = await res.json()
        toast.error('Failed to post job: ' + JSON.stringify(errors))
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#38bdf8] hover:bg-[#0ea5e9] text-black font-bold rounded-xl">
          <PlusCircle className="h-4 w-4 mr-2" />
          Post New Job
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0f172a] border-gray-800 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Post a New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Project Title</Label>
              <Input 
                required 
                placeholder="e.g. React Frontend Help" 
                className="bg-[#1e293b] border-gray-700"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Company / Your Name</Label>
              <Input 
                required 
                placeholder="e.g. My Startup" 
                className="bg-[#1e293b] border-gray-700"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea 
              required 
              placeholder="Describe the tasks and requirements..." 
              className="bg-[#1e293b] border-gray-700 min-h-[100px]"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Location</Label>
              <Input 
                required 
                placeholder="e.g. Remote, Bangalore" 
                className="bg-[#1e293b] border-gray-700"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Budget (e.g. ₹5,000)</Label>
              <Input 
                required 
                placeholder="₹10,000 / month" 
                className="bg-[#1e293b] border-gray-700"
                value={formData.salary}
                onChange={(e) => setFormData({...formData, salary: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Level (e.g. Entry Level)</Label>
              <Input 
                required 
                placeholder="Entry Level, Intermediate" 
                className="bg-[#1e293b] border-gray-700"
                value={formData.level}
                onChange={(e) => setFormData({...formData, level: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Skills (Comma separated)</Label>
              <Input 
                required 
                placeholder="React, CSS, Node.js" 
                className="bg-[#1e293b] border-gray-700"
                value={formData.skills}
                onChange={(e) => setFormData({...formData, skills: e.target.value})}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-[#38bdf8] hover:bg-[#0ea5e9] text-black font-bold px-8"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : 'Publish Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
