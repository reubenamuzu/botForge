'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'
import { Check, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import type { Plan, UsageStats } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

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

export default function BillingPage() {
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
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Billing</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your plan and view usage.</p>
      </div>

      {/* Usage summary */}
      {usage && (
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">Messages this month</p>
              <span className="text-sm text-gray-500">
                {usage.messageCount.toLocaleString()} / {msgLimit === Infinity ? '∞' : msgLimit.toLocaleString()}
              </span>
            </div>
            <Progress value={msgPct} className="h-2 [&>[data-slot=progress-indicator]]:bg-[#6C47FF]" />
            {msgPct >= 90 && (
              <p className="mt-2 text-xs text-amber-600">
                You&apos;re nearly at your message limit.
              </p>
            )}
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">Bots used</p>
              <span className="text-sm text-gray-500">
                {usage.botCount} / {botLimit}
              </span>
            </div>
            <Progress
              value={usage.limits.maxBots === Infinity ? 0 : Math.min(100, Math.round((usage.botCount / usage.limits.maxBots) * 100))}
              className="h-2 [&>[data-slot=progress-indicator]]:bg-[#6C47FF]"
            />
          </div>
        </div>
      )}

      {/* Plan cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => {
          const isCurrent = usage?.plan === plan.key
          const planIndex = PLAN_ORDER.indexOf(plan.key)
          const isDowngrade = planIndex < currentPlanIndex
          const isUpgrade = planIndex > currentPlanIndex

          return (
            <Card
              key={plan.key}
              className={isCurrent ? 'border-[#6C47FF] ring-1 ring-[#6C47FF]' : undefined}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{plan.label}</CardTitle>
                  {isCurrent && (
                    <Badge className="bg-[#6C47FF] text-white hover:bg-[#6C47FF]">
                      Current
                    </Badge>
                  )}
                  {plan.highlighted && !isCurrent && (
                    <Badge variant="secondary" className="text-xs">
                      Popular
                    </Badge>
                  )}
                </div>
                <div className="mt-1">
                  <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                  <span className="ml-1 text-sm text-gray-500">{plan.priceNote}</span>
                </div>
              </CardHeader>

              <CardContent className="pb-4">
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#6C47FF]" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                {isCurrent ? (
                  <Button variant="outline" size="sm" className="w-full" disabled>
                    Current plan
                  </Button>
                ) : isDowngrade ? (
                  <Button variant="ghost" size="sm" className="w-full text-gray-400" disabled>
                    Downgrade
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="w-full gap-1.5 bg-[#6C47FF] hover:bg-[#5835ee]"
                    disabled={!isUpgrade || upgrading !== null}
                    onClick={() => handleUpgrade(plan.key)}
                  >
                    {upgrading === plan.key ? (
                      'Redirecting…'
                    ) : (
                      <>
                        <Zap className="h-3.5 w-3.5" />
                        Upgrade
                      </>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
