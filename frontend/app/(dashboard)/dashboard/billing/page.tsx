'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'
import { Check, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import type { Plan, UsageStats } from '@/lib/types'
import { Progress } from '@/components/ui/progress'

interface PlanConfig {
  key: Plan
  label: string
  price: string
  priceNote: string
  features: string[]
  highlighted?: boolean
}

const PLANS: PlanConfig[] = [
  {
    key: 'FREE',
    label: 'Free',
    price: 'GHS 0',
    priceNote: 'forever',
    features: ['1 bot', '50 messages / month', 'FAQ sources only', 'BotForge branding'],
  },
  {
    key: 'STARTER',
    label: 'Starter',
    price: 'GHS 120',
    priceNote: '/ month',
    features: ['2 bots', '1,000 messages / month', 'All source types', 'No branding'],
    highlighted: true,
  },
  {
    key: 'PRO',
    label: 'Pro',
    price: 'GHS 300',
    priceNote: '/ month',
    features: ['5 bots', '5,000 messages / month', 'All source types', 'WhatsApp integration'],
  },
  {
    key: 'AGENCY',
    label: 'Agency',
    price: 'GHS 700',
    priceNote: '/ month',
    features: ['Unlimited bots', '20,000 messages / month', 'All source types', 'White-label widget'],
  },
]

const PLAN_ORDER: Plan[] = ['FREE', 'STARTER', 'PRO', 'AGENCY']

const gridStyle = {
  backgroundImage:
    'linear-gradient(rgba(108,71,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(108,71,255,0.07) 1px, transparent 1px)',
  backgroundSize: '64px 64px',
}

function BillingPageContent() {
  const { getToken } = useAuth()
  const searchParams = useSearchParams()
  const [usage, setUsage] = useState<UsageStats | null>(null)
  const [upgrading, setUpgrading] = useState<Plan | null>(null)

  const fetchUsage = useCallback(async () => {
    try {
      const token = await getToken()
      const { data } = await api.get<UsageStats>('/billing/usage', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsage(data)
    } catch {
      toast.error('Failed to load billing info')
    }
  }, [getToken])

  useEffect(() => {
    fetchUsage()
  }, [fetchUsage])

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast.success('Plan upgraded successfully!')
    } else if (searchParams.get('error')) {
      toast.error('Payment was not completed. Please try again.')
    }
  }, [searchParams])

  async function handleUpgrade(plan: Plan) {
    if (plan === 'FREE') return
    setUpgrading(plan)
    try {
      const token = await getToken()
      const { data } = await api.post<{ authorizationUrl: string }>(
        '/billing/initialize',
        { plan },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      window.location.href = data.authorizationUrl
    } catch {
      toast.error('Failed to start checkout. Please try again.')
      setUpgrading(null)
    }
  }

  const currentPlanIndex = usage ? PLAN_ORDER.indexOf(usage.plan) : 0
  const msgLimit = usage?.limits.maxMessagesPerMonth ?? 50
  const msgPct = usage ? Math.min(100, Math.round((usage.messageCount / msgLimit) * 100)) : 0
  const botLimit = usage?.limits.maxBots === Infinity ? '∞' : String(usage?.limits.maxBots ?? 1)

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page header strip */}
      <div className="relative -mx-3 -mt-3 mb-6 overflow-hidden border-b border-[#E8E3F5] bg-[#F8F8FF] px-4 py-6 dark:border-white/[0.08] dark:bg-[#0E0820] sm:-mx-6 sm:-mt-6 sm:mb-8 sm:px-8 sm:py-8 lg:-mx-8 lg:-mt-8">
        <div className="pointer-events-none absolute inset-0" style={gridStyle} />
        <div className="relative">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#E8E3F5] dark:border-white/10 bg-white dark:bg-white/5 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#4F35CC] dark:text-[#c9b1ff]">
            BILLING
          </div>
          <h1 className="text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-[#1A1035] dark:text-[#F4F1FF] sm:text-[32px]">
            Plans &{' '}
            <em style={{ fontFamily: 'var(--font-instrument-serif)', fontStyle: 'italic', fontWeight: 400 }}>
              Billing.
            </em>
          </h1>
          <p className="mt-2 font-mono text-[12px] text-[#6B6490] dark:text-[#8B82B0]">
            Manage your plan and view usage.
          </p>
        </div>
      </div>

      {/* Usage summary */}
      {!usage ? (
        <div className="grid animate-pulse gap-4 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-2xl border border-[#E8E3F5] dark:border-white/[0.08] bg-white dark:bg-[#15102E] p-6">
              <div className="mb-3 flex items-center justify-between">
                <div className="h-3 w-36 rounded bg-[#F0EDFA] dark:bg-white/5" />
                <div className="h-3 w-16 rounded bg-[#F0EDFA] dark:bg-white/5" />
              </div>
              <div className="h-2 rounded-full bg-[#F0EDFA] dark:bg-white/5" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#E8E3F5] dark:border-white/[0.08] bg-white dark:bg-[#15102E] p-6">
            <div className="mb-1 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[#6B6490] dark:text-[#8B82B0]">
              Messages this month
            </div>
            <div className="font-mono text-[32px] font-bold leading-none tracking-[-0.03em] text-[#1A1035] dark:text-[#F4F1FF] sm:text-[36px]">
              {usage.messageCount.toLocaleString()}
            </div>
            <div className="mt-1 font-mono text-[11px] text-[#6B6490] dark:text-[#8B82B0]">
              {usage.messageCount.toLocaleString()} / {msgLimit === Infinity ? '∞' : msgLimit.toLocaleString()} used
            </div>
            <Progress value={msgPct} className="mt-3 h-1 [&>[data-slot=progress-indicator]]:bg-[#6C47FF]" />
            {msgPct >= 90 && (
              <p className="mt-2 font-mono text-[11px] text-amber-600">
                You&apos;re nearly at your message limit.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-[#E8E3F5] dark:border-white/[0.08] bg-white dark:bg-[#15102E] p-6">
            <div className="mb-1 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[#6B6490] dark:text-[#8B82B0]">
              Bots used
            </div>
            <div className="font-mono text-[32px] font-bold leading-none tracking-[-0.03em] text-[#1A1035] dark:text-[#F4F1FF] sm:text-[36px]">
              {usage.botCount}
            </div>
            <div className="mt-1 font-mono text-[11px] text-[#6B6490] dark:text-[#8B82B0]">
              {usage.botCount} / {botLimit} used
            </div>
            <Progress
              value={usage.limits.maxBots === Infinity ? 0 : Math.min(100, Math.round((usage.botCount / usage.limits.maxBots) * 100))}
              className="mt-3 h-1 [&>[data-slot=progress-indicator]]:bg-[#6C47FF]"
            />
          </div>
        </div>
      )}

      {/* Plan cards */}
      <div>
        <div className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#6B6490] dark:text-[#8B82B0]">
          Choose a Plan
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {PLANS.map((plan) => {
            const isCurrent = usage?.plan === plan.key
            const planIndex = PLAN_ORDER.indexOf(plan.key)
            const isDowngrade = planIndex < currentPlanIndex
            const isUpgrade = planIndex > currentPlanIndex
            const isPopular = plan.highlighted && !isCurrent

            return (
              <div
                key={plan.key}
                className={
                  isCurrent
                    ? 'flex flex-col rounded-2xl border border-[#6C47FF] bg-[#1A1035] dark:bg-white/[0.07] p-6 text-white'
                    : 'flex flex-col rounded-2xl border border-[#E8E3F5] dark:border-white/[0.08] bg-white dark:bg-[#15102E] p-6'
                }
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#6C47FF] dark:text-[#8B6FFF]">
                    {plan.label}
                  </div>
                  {isCurrent && (
                    <span className="rounded-full bg-[#6C47FF] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-white">
                      current
                    </span>
                  )}
                  {isPopular && (
                    <span className="rounded-full bg-[#F0EDFA] dark:bg-white/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-[#6C47FF] dark:text-[#8B6FFF]">
                      popular
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <span className={`text-2xl font-bold ${isCurrent ? 'text-white' : 'text-[#1A1035] dark:text-[#F4F1FF]'}`}>
                    {plan.price}
                  </span>
                  <span className={`ml-1 font-mono text-[12px] ${isCurrent ? 'text-white/60' : 'text-[#6B6490] dark:text-[#8B82B0]'}`}>
                    {plan.priceNote}
                  </span>
                </div>

                <ul className="mb-6 flex-1 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 font-mono text-[13px] ${isCurrent ? 'text-white/80' : 'text-[#6B6490] dark:text-[#8B82B0]'}`}>
                      <Check className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${isCurrent ? 'text-white' : 'text-[#6C47FF]'}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <button
                    disabled
                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 font-mono text-[12px] font-bold uppercase tracking-[0.08em] text-white/60 cursor-not-allowed"
                  >
                    Current plan
                  </button>
                ) : isDowngrade ? (
                  <button
                    disabled
                    className="w-full rounded-xl border border-[#E8E3F5] dark:border-white/[0.08] px-4 py-2.5 font-mono text-[12px] font-bold uppercase tracking-[0.08em] text-[#6B6490] dark:text-[#8B82B0] cursor-not-allowed opacity-50"
                  >
                    Downgrade
                  </button>
                ) : (
                  <button
                    disabled={!isUpgrade || upgrading !== null}
                    onClick={() => handleUpgrade(plan.key)}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#6C47FF] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#5835ee] disabled:opacity-60"
                  >
                    {upgrading === plan.key ? (
                      'Redirecting…'
                    ) : (
                      <>
                        <Zap className="h-3.5 w-3.5" />
                        Upgrade
                      </>
                    )}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function BillingPage() {
  return (
    <Suspense>
      <BillingPageContent />
    </Suspense>
  )
}
