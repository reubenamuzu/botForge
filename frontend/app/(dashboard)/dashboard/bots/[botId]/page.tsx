'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Code2, FlaskConical } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import type { Bot, KnowledgeItem } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ConfigureTab } from './_components/ConfigureTab'
import { KnowledgeBaseTab } from './_components/KnowledgeBaseTab'
import { AppearanceTab } from './_components/AppearanceTab'

export default function BotDetailPage() {
  const { botId } = useParams<{ botId: string }>()
  const { getToken } = useAuth()
  const router = useRouter()
  const [bot, setBot] = useState<Bot | null>(null)
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const token = await getToken()
      const headers = { Authorization: `Bearer ${token}` }
      const [botRes, knowledgeRes] = await Promise.all([
        api.get<Bot>(`/bots/${botId}`, { headers }),
        api.get<KnowledgeItem[]>(`/bots/${botId}/knowledge`, { headers }),
      ])
      setBot(botRes.data)
      setKnowledge(knowledgeRes.data)
    } catch {
      toast.error('Failed to load bot')
      router.push('/dashboard/bots')
    } finally {
      setLoading(false)
    }
  }, [botId, getToken, router])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-gray-200" />
          <div className="h-9 w-9 rounded-full bg-gray-200" />
          <div className="h-5 w-40 rounded-md bg-gray-200" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <div className="h-9 w-24 rounded-md bg-gray-200" />
            <div className="h-9 w-32 rounded-md bg-gray-200" />
            <div className="h-9 w-28 rounded-md bg-gray-200" />
          </div>
          <div className="flex gap-2">
            <div className="h-9 w-20 rounded-md bg-gray-200" />
            <div className="h-9 w-20 rounded-md bg-gray-200" />
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <div className="h-48 rounded-xl bg-gray-200" />
          <div className="h-32 rounded-xl bg-gray-200" />
        </div>
      </div>
    )
  }

  if (!bot) return null

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href="/dashboard/bots">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6C47FF] text-sm font-semibold text-white">
          {bot.name.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{bot.name}</h1>
      </div>

      <Tabs defaultValue="configure">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="configure">Configure</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <Link href={`/dashboard/bots/${botId}/test`}>
                <FlaskConical className="h-3.5 w-3.5" />
                Test
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <Link href={`/dashboard/bots/${botId}/embed`}>
                <Code2 className="h-3.5 w-3.5" />
                Embed
              </Link>
            </Button>
          </div>
        </div>
        <TabsContent value="configure" className="mt-6">
          <ConfigureTab bot={bot} onSaved={setBot} />
        </TabsContent>
        <TabsContent value="knowledge" className="mt-6">
          <KnowledgeBaseTab botId={botId} items={knowledge} onItemsChanged={setKnowledge} />
        </TabsContent>
        <TabsContent value="appearance" className="mt-6">
          <AppearanceTab bot={bot} onSaved={setBot} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
