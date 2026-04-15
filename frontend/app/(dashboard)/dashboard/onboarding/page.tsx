'use client'

import { useCallback, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Bot, BookOpen, Code2, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const STEPS = [
  { id: 1, label: 'Create Bot',      icon: Bot      },
  { id: 2, label: 'Add Knowledge',   icon: BookOpen },
  { id: 3, label: 'Get Embed Code',  icon: Code2    },
]

export default function OnboardingPage() {
  const { getToken } = useAuth()
  const router = useRouter()

  const [step,          setStep]          = useState(1)
  const [loading,       setLoading]       = useState(false)

  // Step 1
  const [botName,  setBotName]  = useState('')
  const [greeting, setGreeting] = useState('')
  const [createdBotId, setCreatedBotId] = useState<string | null>(null)

  // Step 2
  const [question, setQuestion] = useState('')
  const [answer,   setAnswer]   = useState('')

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ??
    'https://your-domain.com'
  const embedCode = createdBotId
    ? `<script src="${apiUrl}/widget.js" data-bot-id="${createdBotId}"></script>`
    : ''

  /* ── helpers ── */
  async function headers() {
    const token = await getToken()
    return { Authorization: `Bearer ${token}` }
  }

  async function markDone() {
    try {
      await api.patch('/users/me/onboarding', {}, { headers: await headers() })
    } catch { /* non-fatal */ }
  }

  /* ── Step 1 — create bot ── */
  const handleCreateBot = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const h = await headers()
      const { data } = await api.post<{ id: string }>(
        '/bots',
        { name: botName, greeting, tone: 'FRIENDLY', fallbackMsg: "I'm not sure about that, but I'm here to help!" },
        { headers: h },
      )
      setCreatedBotId(data.id)
      setStep(2)
    } catch (err: any) {
      if (err?.response?.status === 403 && err?.response?.data?.code === 'LIMIT_EXCEEDED') {
        toast.error('Bot limit reached', { description: 'Upgrade your plan to create more bots.' })
      } else {
        toast.error('Failed to create bot')
      }
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [botName, greeting, getToken])

  /* ── Step 2 — add FAQ ── */
  const handleAddKnowledge = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createdBotId) return
    setLoading(true)
    try {
      const h = await headers()
      await api.post(
        `/bots/${createdBotId}/knowledge`,
        { type: 'FAQ', question, answer },
        { headers: h },
      )
      setStep(3)
    } catch {
      toast.error('Failed to add knowledge item')
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdBotId, question, answer, getToken])

  /* ── Step 3 — finish ── */
  const handleFinish = useCallback(async () => {
    setLoading(true)
    await markDone()
    router.push(createdBotId ? `/dashboard/bots/${createdBotId}` : '/dashboard')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdBotId, router, getToken])

  /* ── skip entire flow ── */
  const handleSkipAll = useCallback(async () => {
    await markDone()
    router.push('/dashboard')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, getToken])

  return (
    <div className="flex min-h-full flex-col items-center justify-center py-12 px-4">

      {/* ── Progress stepper ── */}
      <div className="mb-10 flex items-center gap-0">
        {STEPS.map((s, i) => {
          const Icon = s.icon
          const done   = step > s.id
          const active = step === s.id
          return (
            <div key={s.id} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200',
                    done   ? 'bg-[#6C47FF] text-white shadow-md shadow-[#6C47FF]/30'
                           : active ? 'bg-[#f0ebff] text-[#6C47FF] ring-2 ring-[#6C47FF]'
                                    : 'bg-[#f4f4f8] dark:bg-[#1e1340] text-[#6B6490]',
                  )}
                >
                  {done ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
                </div>
                <span
                  className={cn(
                    'hidden text-xs font-medium sm:block',
                    active ? 'text-[#1A1035] dark:text-white' : 'text-[#6B6490] dark:text-[#a19bb8]',
                  )}
                >
                  {s.label}
                </span>
              </div>

              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    'mx-3 mb-4 h-px w-16 transition-all duration-300',
                    step > s.id ? 'bg-[#6C47FF]' : 'bg-[#ede9f8] dark:bg-[#382b61]',
                  )}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* ── Card ── */}
      <div className="w-full max-w-lg rounded-2xl border border-[#ede9f8] dark:border-[#382b61] bg-white dark:bg-[#1A1035] p-8 shadow-lg">

        {/* Step 1 — Create bot */}
        {step === 1 && (
          <form onSubmit={handleCreateBot} className="space-y-6">
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0ebff]">
                <Sparkles className="h-6 w-6 text-[#6C47FF]" />
              </div>
              <h1 className="text-2xl font-bold text-[#1A1035] dark:text-white">
                Welcome to BotForge!
              </h1>
              <p className="mt-1 text-sm text-[#6B6490] dark:text-[#a19bb8]">
                Let&apos;s create your first bot in under 2 minutes.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="bot-name">Bot name</Label>
                <Input
                  id="bot-name"
                  placeholder="e.g. Support Assistant"
                  value={botName}
                  onChange={e => setBotName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bot-greeting">Greeting message</Label>
                <Textarea
                  id="bot-greeting"
                  placeholder="e.g. Hi! How can I help you today?"
                  value={greeting}
                  onChange={e => setGreeting(e.target.value)}
                  required
                  rows={3}
                />
                <p className="text-xs text-[#6B6490] dark:text-[#a19bb8]">
                  This is the first message your visitors will see.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleSkipAll}
                className="text-sm text-[#6B6490] transition-colors hover:text-[#1A1035] dark:hover:text-white"
              >
                Skip setup
              </button>
              <Button
                type="submit"
                disabled={loading || !botName.trim() || !greeting.trim()}
                className="bg-[#6C47FF] hover:bg-[#5835ee] text-white"
              >
                {loading ? 'Creating…' : 'Create Bot'}
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </form>
        )}

        {/* Step 2 — Add knowledge */}
        {step === 2 && (
          <form onSubmit={handleAddKnowledge} className="space-y-6">
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0ebff]">
                <BookOpen className="h-6 w-6 text-[#6C47FF]" />
              </div>
              <h1 className="text-2xl font-bold text-[#1A1035] dark:text-white">
                Teach your bot
              </h1>
              <p className="mt-1 text-sm text-[#6B6490] dark:text-[#a19bb8]">
                Add one FAQ so your bot knows what to say. You can add more anytime.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="faq-q">Question</Label>
                <Input
                  id="faq-q"
                  placeholder="e.g. What are your opening hours?"
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="faq-a">Answer</Label>
                <Textarea
                  id="faq-a"
                  placeholder="e.g. We're open Monday to Friday, 9 am – 5 pm."
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  required
                  rows={4}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="text-sm text-[#6B6490] transition-colors hover:text-[#1A1035] dark:hover:text-white"
              >
                Skip this step
              </button>
              <Button
                type="submit"
                disabled={loading || !question.trim() || !answer.trim()}
                className="bg-[#6C47FF] hover:bg-[#5835ee] text-white"
              >
                {loading ? 'Saving…' : 'Add & Continue'}
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </form>
        )}

        {/* Step 3 — Embed code */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-900/20">
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              </div>
              <h1 className="text-2xl font-bold text-[#1A1035] dark:text-white">
                Your bot is ready!
              </h1>
              <p className="mt-1 text-sm text-[#6B6490] dark:text-[#a19bb8]">
                Paste this snippet just before the{' '}
                <code className="rounded bg-[#f4f4f8] dark:bg-[#130b29] px-1 py-0.5 font-mono text-xs">
                  &lt;/body&gt;
                </code>{' '}
                tag on your website.
              </p>
            </div>

            {embedCode && (
              <div className="group relative rounded-xl bg-[#130b29] dark:bg-[#0d0820] p-4">
                <p className="select-all break-all font-mono text-xs leading-relaxed text-emerald-400">
                  {embedCode}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(embedCode)
                    toast.success('Copied to clipboard')
                  }}
                  className="absolute right-3 top-3 rounded-lg bg-white/10 px-2 py-1 text-[10px] font-semibold text-white/70 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white/20"
                >
                  Copy
                </button>
              </div>
            )}

            <p className="text-xs text-[#6B6490] dark:text-[#a19bb8]">
              You can find this code anytime from your bot&apos;s{' '}
              <strong className="text-[#6C47FF]">Embed</strong> tab.
            </p>

            <Button
              onClick={handleFinish}
              disabled={loading}
              className="w-full bg-[#6C47FF] hover:bg-[#5835ee] text-white"
            >
              {loading ? 'Loading…' : 'Go to my bot'}
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Step counter */}
      <p className="mt-6 text-xs text-[#6B6490] dark:text-[#a19bb8]">
        Step {step} of {STEPS.length}
      </p>
    </div>
  )
}
