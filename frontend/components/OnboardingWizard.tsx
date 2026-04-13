'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Check, Copy, Bot, MessageSquare, Code2 } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import type { Bot as BotType, CurrentUser } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api').replace(
  /\/api$/,
  ''
)

const STEPS = [
  { icon: Bot, label: 'Name your bot' },
  { icon: MessageSquare, label: 'Add your first FAQ' },
  { icon: Code2, label: 'Copy embed code' },
]

export function OnboardingWizard() {
  const { getToken } = useAuth()
  const router = useRouter()

  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)

  // Step 1
  const [botName, setBotName] = useState('')
  // Step 2
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  // Created bot
  const [bot, setBot] = useState<BotType | null>(null)

  // Check if onboarding is needed
  const checkOnboarding = useCallback(async () => {
    try {
      const token = await getToken()
      const { data } = await api.get<CurrentUser>('/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!data.onboardingDone) setVisible(true)
    } catch {
      // silently ignore — don't block the dashboard on a failed check
    }
  }, [getToken])

  useEffect(() => {
    checkOnboarding()
  }, [checkOnboarding])

  async function handleCreateBot() {
    if (!botName.trim()) return
    setSaving(true)
    try {
      const token = await getToken()
      const { data } = await api.post<BotType>(
        '/bots',
        {
          name: botName.trim(),
          greeting: `Hi! I'm ${botName.trim()}. How can I help you today?`,
          tone: 'FRIENDLY',
          fallbackMsg: "I'm sorry, I didn't understand that. Could you rephrase?",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setBot(data)
      setStep(1)
    } catch {
      toast.error('Failed to create bot. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleAddFAQ() {
    if (!bot || !question.trim() || !answer.trim()) return
    setSaving(true)
    try {
      const token = await getToken()
      await api.post(
        `/bots/${bot.id}/knowledge`,
        { type: 'FAQ', question: question.trim(), answer: answer.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setStep(2)
    } catch {
      toast.error('Failed to save FAQ. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleFinish() {
    setSaving(true)
    try {
      const token = await getToken()
      await api.patch('/users/me/onboarding', {}, { headers: { Authorization: `Bearer ${token}` } })
      setVisible(false)
      router.push('/dashboard/bots')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  function copySnippet() {
    if (!bot) return
    const snippet = `<script src="${API_BASE}/widget.js" data-bot-id="${bot.id}"></script>`
    navigator.clipboard.writeText(snippet)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  if (!visible) return null

  const snippet = bot
    ? `<script src="${API_BASE}/widget.js" data-bot-id="${bot.id}"></script>`
    : ''

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#1A1035] shadow-2xl">
        {/* Header */}
        <div className="border-b border-gray-100 px-8 pt-8 pb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Welcome to BotForge 👋</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Let&apos;s get your first bot up and running in 3 quick steps.
          </p>

          {/* Step indicators */}
          <div className="mt-6 flex items-center gap-3">
            {STEPS.map((s, i) => {
              const done = i < step
              const active = i === step
              return (
                <div key={i} className="flex flex-1 items-center gap-2">
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                      done
                        ? 'bg-indigo-600 text-white'
                        : active
                        ? 'border-2 border-indigo-600 text-indigo-600'
                        : 'border-2 border-gray-200 dark:border-[#382b61] text-gray-400'
                    }`}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </div>
                  <span
                    className={`hidden text-xs font-medium sm:block ${
                      active ? 'text-indigo-600' : done ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400'
                    }`}
                  >
                    {s.label}
                  </span>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`ml-auto h-px flex-1 ${done ? 'bg-indigo-300' : 'bg-gray-200'}`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-6">
          {/* Step 0: Name your bot */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-xl bg-indigo-50 p-4">
                <Bot className="h-8 w-8 text-indigo-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Name your first bot</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Give it a friendly name your customers will recognise.
                  </p>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bot-name">Bot name</Label>
                <Input
                  id="bot-name"
                  placeholder="e.g. Support Bot, Acme Assistant…"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateBot()}
                  autoFocus
                />
              </div>
              <Button
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                disabled={!botName.trim() || saving}
                onClick={handleCreateBot}
              >
                {saving ? 'Creating…' : 'Create bot →'}
              </Button>
            </div>
          )}

          {/* Step 1: Add first FAQ */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-xl bg-indigo-50 p-4">
                <MessageSquare className="h-8 w-8 text-indigo-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Add your first FAQ</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Teach your bot to answer a common customer question.
                  </p>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="faq-question">Question</Label>
                <Input
                  id="faq-question"
                  placeholder="e.g. What are your opening hours?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="faq-answer">Answer</Label>
                <Textarea
                  id="faq-answer"
                  placeholder="e.g. We're open Monday to Friday, 9am–5pm."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={3}
                />
              </div>
              <Button
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                disabled={!question.trim() || !answer.trim() || saving}
                onClick={handleAddFAQ}
              >
                {saving ? 'Saving…' : 'Save FAQ →'}
              </Button>
            </div>
          )}

          {/* Step 2: Copy embed code */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-xl bg-indigo-50 p-4">
                <Code2 className="h-8 w-8 text-indigo-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Copy your embed code</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Paste this snippet before the{' '}
                    <code className="font-mono">&lt;/body&gt;</code> tag on your site.
                  </p>
                </div>
              </div>
              <div className="relative rounded-lg bg-gray-950 p-4">
                <pre className="overflow-x-auto pr-16 text-xs leading-relaxed text-emerald-400">
                  <code>{snippet}</code>
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={copySnippet}
                  className="absolute right-2 top-2 h-7 gap-1.5 text-gray-400 hover:bg-gray-800 hover:text-white"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <Button
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                disabled={saving}
                onClick={handleFinish}
              >
                {saving ? 'Finishing…' : "I'm done — go to my dashboard →"}
              </Button>
              <p className="text-center text-xs text-gray-400">
                You can always find this code in the Embed tab of your bot.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
