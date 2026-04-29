'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutForm({ amount, onSuccess }: { amount: number, onSuccess: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) return

    setIsProcessing(true)

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard?payment=success`,
      },
      redirect: 'if_required',
    })

    if (error) {
      toast.error(error.message || 'An error occurred')
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      toast.success('Payment successful!')
      onSuccess()
    }

    setIsProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing} 
        className="w-full bg-violet-600 hover:bg-violet-700 text-white"
      >
        {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : `Pay ₹${amount}`}
      </Button>
    </form>
  )
}

export function MentorPaymentModal({ 
  mentorName, 
  amount, 
  onSuccess 
}: { 
  mentorName: string, 
  amount: number, 
  onSuccess: () => void 
}) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open)
    if (open && !clientSecret) {
      try {
        const res = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount, metadata: { mentorName } }),
        })
        const data = await res.json()
        setClientSecret(data.clientSecret)
      } catch (error) {
        console.error('Error creating payment intent:', error)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white py-6 rounded-xl font-bold text-lg">
          Confirm & Pay ₹{amount}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0f0f0f] text-white border-gray-800">
        <DialogHeader>
          <DialogTitle>Complete Payment for {mentorName}</DialogTitle>
        </DialogHeader>
        {clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
            <CheckoutForm amount={amount} onSuccess={() => {
              setIsOpen(false)
              onSuccess()
            }} />
          </Elements>
        ) : (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
