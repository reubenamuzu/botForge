'use client'

import { useRef, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Flag } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

const CATEGORIES = ['Bug', 'Feature Request', 'Account Issue', 'Billing', 'Other'] as const

interface Props {
  open: boolean
  onClose: () => void
  collapsed?: boolean
}

export function ReportIssueDialog({ open, onClose, collapsed }: Props) {
  const { getToken } = useAuth()
  const fileRef = useRef<HTMLInputElement>(null)

  const [category, setCategory] = useState<string>('Bug')
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [screenshot, setScreenshot] = useState<{ base64: string; name: string } | null>(null)
  const [loading, setLoading] = useState(false)

  function reset() {
    setCategory('Bug')
    setSubject('')
    setDescription('')
    setScreenshot(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  function handleClose() {
    reset()
    onClose()
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Screenshot must be under 5 MB')
      e.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // Strip data URL prefix — Resend wants raw base64
      setScreenshot({ base64: result.split(',')[1], name: file.name })
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!subject.trim() || !description.trim()) return
    setLoading(true)
    try {
      const token = await getToken()
      await api.post(
        '/users/me/report',
        {
          category,
          subject: subject.trim(),
          description: description.trim(),
          ...(screenshot ? { screenshotBase64: screenshot.base64, screenshotName: screenshot.name } : {}),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success("Report sent — we'll look into it shortly.")
      handleClose()
    } catch {
      toast.error('Failed to send report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose() }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="h-4 w-4 text-[#6C47FF]" />
            Report an Issue
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={cn(
                    'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                    category === c
                      ? 'border-[#6C47FF] bg-[#f0ebff] text-[#6C47FF] dark:bg-[#2d1f5e]'
                      : 'border-gray-200 dark:border-[#382b61] text-gray-500 dark:text-gray-400 hover:border-[#6C47FF] hover:text-[#6C47FF]'
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief summary of the issue"
              maxLength={120}
              required
              className="w-full rounded-lg border border-gray-200 dark:border-[#382b61] bg-white dark:bg-[#130b29] px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C47FF]/40"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what happened, steps to reproduce, or what you'd like to see..."
              rows={4}
              required
              className="w-full resize-none rounded-lg border border-gray-200 dark:border-[#382b61] bg-white dark:bg-[#130b29] px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C47FF]/40"
            />
          </div>

          {/* Screenshot */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Screenshot <span className="font-normal text-gray-400">(optional, max 5 MB)</span>
            </label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-3 file:rounded-lg file:border-0 file:bg-[#f0ebff] file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-[#6C47FF] hover:file:bg-[#e5deff]"
            />
            {screenshot && (
              <p className="text-xs text-gray-400">Attached: {screenshot.name}</p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !subject.trim() || !description.trim()}
              className="bg-[#6C47FF] hover:bg-[#5835ee]"
            >
              {loading ? 'Sending…' : 'Send Report'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
