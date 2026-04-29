'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, Send, MessageSquare, Terminal } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useUser } from '@clerk/nextjs'
import { cn } from '@/lib/utils'

interface Message {
  _id: string
  senderId: string
  text: string
  createdAt: string
}

interface Conversation {
  _id: string
  participants: string[]
  otherParticipant?: {
    id: string
    name: string
    image?: string | null
  }
  lastMessage?: {
    text: string
    senderId: string
    createdAt: string
  }
  updatedAt: string
}

export function ChatInterface() {
  const { user } = useUser()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id)
    }
  }, [selectedConversation])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/conversations')
      if (res.ok) {
        const data = await res.json()
        setConversations(data)
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMessages = async (conversationId: string) => {
    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation || isSending) return

    setIsSending(true)
    try {
      const res = await fetch(`/api/conversations/${selectedConversation._id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newMessage })
      })

      if (res.ok) {
        const sentMessage = await res.json()
        setMessages([...messages, sentMessage])
        setNewMessage('')
        fetchConversations() // Update last message in list
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsSending(false)
    }
  }

  const getOtherParticipantId = (participants: string[]) => {
    return participants.find(id => id !== user?.id) || 'Unknown'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[500px] bg-black border border-white/5 rounded-3xl">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Decrypting Channels...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-[320px_1fr] gap-0 h-[650px] bg-black border border-white/5 rounded-[2.5rem] overflow-hidden">
      {/* Conversation List */}
      <div className="border-r border-white/5 flex flex-col bg-white/[0.01]">
        <div className="p-6 border-b border-white/5 bg-white/[0.02]">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <Terminal className="h-4 w-4 text-cyan-500" /> Secure_Channels
          </h3>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-1">
            {conversations.length === 0 ? (
              <div className="text-center py-20 px-6">
                <p className="text-xs text-slate-600 uppercase font-bold tracking-widest mb-2">Empty Buffer</p>
                <p className="text-[11px] text-slate-700 leading-relaxed italic">No active communication nodes found in the current session.</p>
              </div>
            ) : (
              conversations.map((conv) => {
                const other = conv.otherParticipant
                return (
                  <button
                    key={conv._id}
                    onClick={() => setSelectedConversation(conv)}
                    className={cn(
                      "w-full text-left p-4 rounded-2xl transition-all duration-300 group",
                      selectedConversation?._id === conv._id
                        ? "bg-white/[0.05] border border-white/10 shadow-2xl"
                        : "hover:bg-white/[0.02] border border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-10 w-10 border border-white/5 group-hover:border-white/20 transition-all">
                          {other?.image && <AvatarImage src={other.image} className="object-cover" />}
                          <AvatarFallback className="bg-white/5 text-slate-500 text-xs font-bold">
                            {other?.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {selectedConversation?._id === conv._id && (
                          <div className="absolute -top-1 -right-1 h-3 w-3 bg-cyan-500 rounded-full border-2 border-black" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <p className="font-bold text-sm text-white truncate">{other?.name}</p>
                          {conv.lastMessage && (
                            <span className="text-[9px] font-mono text-slate-600 uppercase">
                              {formatDistanceToNow(new Date(conv.lastMessage.createdAt), { addSuffix: false })}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate group-hover:text-slate-400 transition-colors">
                          {conv.lastMessage?.text || 'Awaiting transmission...'}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Window */}
      <div className="flex flex-col bg-black">
        {selectedConversation ? (
          <>
            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-8 w-8 border border-white/10">
                  {selectedConversation.otherParticipant?.image && (
                    <AvatarImage src={selectedConversation.otherParticipant.image} className="object-cover" />
                  )}
                  <AvatarFallback className="bg-white/5 text-slate-500 text-xs font-bold uppercase">
                    {selectedConversation.otherParticipant?.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-white text-sm">{selectedConversation.otherParticipant?.name}</h3>
                  <p className="text-[10px] text-cyan-500 uppercase font-mono tracking-widest">Encrypted_Link_Active</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-mono text-slate-600 uppercase">Online</span>
              </div>
            </div>
            
            <ScrollArea className="flex-1 p-8" viewportRef={scrollRef}>
              <div className="space-y-6">
                {messages.map((msg) => {
                  const isMe = msg.senderId === user?.id
                  return (
                    <div
                      key={msg._id}
                      className={cn("flex", isMe ? 'justify-end' : 'justify-start')}
                    >
                      <div className={cn(
                        "max-w-[75%] space-y-1.5",
                        isMe ? "items-end" : "items-start"
                      )}>
                        <div
                          className={cn(
                            "p-4 rounded-2xl text-[13px] leading-relaxed shadow-lg transition-all",
                            isMe
                              ? "bg-white text-black font-medium rounded-tr-none"
                              : "bg-white/[0.05] border border-white/5 text-slate-300 rounded-tl-none"
                          )}
                        >
                          <p>{msg.text}</p>
                        </div>
                        <p className={cn(
                          "text-[9px] font-mono text-slate-600 uppercase px-1",
                          isMe ? "text-right" : "text-left"
                        )}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>

            <div className="p-6 border-t border-white/5 bg-white/[0.01]">
              <form onSubmit={handleSendMessage} className="flex gap-3 max-w-3xl mx-auto w-full">
                <input
                  placeholder="Transmit message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-5 text-sm text-white focus:outline-none focus:border-white/20 transition-all placeholder:text-slate-700"
                />
                <Button 
                  type="submit" 
                  disabled={isSending || !newMessage.trim()} 
                  className="bg-white text-black hover:bg-slate-200 rounded-xl px-6 font-bold"
                >
                  {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-700 space-y-6">
            <div className="w-20 h-20 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center justify-center">
              <MessageSquare className="h-8 w-8" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Terminal Idle</p>
              <p className="text-[11px] max-w-[200px] leading-relaxed">Select an active node from the sidebar to establish a secure uplink.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
