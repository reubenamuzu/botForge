'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import type { Bot } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface Props {
  bot: Bot
  onSaved: (bot: Bot) => void
}

export function AppearanceTab({ bot, onSaved }: Props) {
  const { getToken } = useAuth()
  const [color, setColor] = useState(bot.widgetColor || '#4f46e5')
  const [hexInput, setHexInput] = useState(bot.widgetColor || '#4f46e5')
  const [position, setPosition] = useState<'bottom-right' | 'bottom-left'>(
    bot.widgetPosition || 'bottom-right'
  )
  const [saving, setSaving] = useState(false)

  function handleHexInput(val: string) {
    setHexInput(val)
    if (/^#[0-9a-fA-F]{6}$/.test(val)) setColor(val)
  }

  function handlePicker(val: string) {
    setColor(val)
    setHexInput(val)
  }

  async function handleSave() {
    if (!/^#[0-9a-fA-F]{6}$/.test(color)) {
      toast.error('Enter a valid hex colour e.g. #4f46e5')
      return
    }
    setSaving(true)
    try {
      const token = await getToken()
      const { data } = await api.patch<Bot>(
        `/bots/${bot.id}`,
        { widgetColor: color, widgetPosition: position },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      onSaved(data)
      toast.success('Appearance saved')
    } catch {
      toast.error('Failed to save appearance')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      {/* Colour picker */}
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label>Widget colour</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => handlePicker(e.target.value)}
                className="h-10 w-14 cursor-pointer rounded-md border border-gray-200 p-0.5"
              />
              <input
                type="text"
                value={hexInput}
                onChange={(e) => handleHexInput(e.target.value)}
                maxLength={7}
                placeholder="#4f46e5"
                className="w-32 rounded-md border border-gray-200 px-3 py-2 font-mono text-sm outline-none focus:border-[#6C47FF] focus:ring-1 focus:ring-[#6C47FF]"
              />
            </div>
            <p className="text-xs text-gray-400">
              Applied to the chat bubble, header, and user message bubbles.
            </p>
          </div>

          {/* Live preview */}
          <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
            <p className="mb-3 text-xs font-medium text-gray-500">Preview</p>
            <div className="flex items-end gap-3">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-md"
                style={{ background: color }}
              >
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div
                className="max-w-[60%] rounded-2xl rounded-br-sm px-3 py-2 text-xs text-white shadow-sm"
                style={{ background: color }}
              >
                Hi! How can I help you today?
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Position */}
      <Card>
        <CardContent className="space-y-3 pt-6">
          <Label>Chat bubble position</Label>
          <div className="grid grid-cols-2 gap-3">
            {(['bottom-right', 'bottom-left'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPosition(p)}
                className={cn(
                  'rounded-lg border-2 p-4 text-left text-sm font-medium transition-colors',
                  position === p
                    ? 'border-[#6C47FF] bg-[#f0ebff] text-[#6C47FF]'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                )}
              >
                <span className="mb-1 block text-xl">{p === 'bottom-right' ? '↘' : '↙'}</span>
                {p === 'bottom-right' ? 'Bottom right' : 'Bottom left'}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="bg-[#6C47FF] hover:bg-[#5835ee]">
        {saving ? 'Saving…' : 'Save appearance'}
      </Button>
    </div>
  )
}
