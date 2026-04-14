'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Trash2, Plus, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import type { KnowledgeItem, KnowledgeType } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'

interface Props {
  botId: string
  items: KnowledgeItem[]
  onItemsChanged: (items: KnowledgeItem[]) => void
}

export function KnowledgeBaseTab({ botId, items, onItemsChanged }: Props) {
  const { getToken } = useAuth()
  const [faqForm, setFaqForm] = useState({ question: '', answer: '' })
  const [urlForm, setUrlForm] = useState({ sourceUrl: '' })
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState<KnowledgeType | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [confirmBulkOpen, setConfirmBulkOpen] = useState(false)

  const faqs = items.filter((i) => i.type === 'FAQ')
  const pdfs = items.filter((i) => i.type === 'PDF')
  const urls = items.filter((i) => i.type === 'URL')

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function selectAll(sectionItems: KnowledgeItem[]) {
    const ids = sectionItems.map((i) => i.id)
    const allSelected = ids.every((id) => selected.has(id))
    setSelected((prev) => {
      const next = new Set(prev)
      if (allSelected) {
        ids.forEach((id) => next.delete(id))
      } else {
        ids.forEach((id) => next.add(id))
      }
      return next
    })
  }

  async function addItem(payload: Record<string, string>, type: KnowledgeType) {
    setSubmitting(type)
    try {
      const token = await getToken()
      const { data } = await api.post<KnowledgeItem>(
        `/bots/${botId}/knowledge`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      onItemsChanged([data, ...items])
      toast.success('Added')
    } catch {
      toast.error('Failed to add item')
    } finally {
      setSubmitting(null)
    }
  }

  async function deleteItem(itemId: string) {
    try {
      const token = await getToken()
      await api.delete(`/bots/${botId}/knowledge/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      onItemsChanged(items.filter((i) => i.id !== itemId))
      setSelected((prev) => { const next = new Set(prev); next.delete(itemId); return next })
      toast.success('Deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  async function bulkDelete() {
    if (selected.size === 0) return
    setBulkDeleting(true)
    try {
      const token = await getToken()
      await Promise.all(
        [...selected].map((id) =>
          api.delete(`/bots/${botId}/knowledge/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      )
      onItemsChanged(items.filter((i) => !selected.has(i.id)))
      setSelected(new Set())
      toast.success(`Deleted ${selected.size} item${selected.size > 1 ? 's' : ''}`)
    } catch {
      toast.error('Failed to delete some items')
    } finally {
      setBulkDeleting(false)
    }
  }

  async function handleAddFaq(e: React.FormEvent) {
    e.preventDefault()
    await addItem({ type: 'FAQ', ...faqForm }, 'FAQ')
    setFaqForm({ question: '', answer: '' })
  }

  async function handleAddUrl(e: React.FormEvent) {
    e.preventDefault()
    await addItem({ type: 'URL', sourceUrl: urlForm.sourceUrl }, 'URL')
    setUrlForm({ sourceUrl: '' })
  }

  async function handleUploadPdf(e: React.FormEvent) {
    e.preventDefault()
    if (!pdfFile) return
    setSubmitting('PDF')
    try {
      const token = await getToken()
      const formData = new FormData()
      formData.append('type', 'PDF')
      formData.append('sourceUrl', pdfFile.name)
      formData.append('file', pdfFile)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bots/${botId}/knowledge`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error((err as { error?: string }).error ?? 'Upload failed')
      }
      const item: KnowledgeItem = await res.json()
      onItemsChanged([item, ...items])
      toast.success('PDF added')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to upload PDF')
    } finally {
      setSubmitting(null)
      setPdfFile(null)
      const input = document.getElementById('pdf-input') as HTMLInputElement | null
      if (input) input.value = ''
    }
  }

  function ItemRow({
    item,
    label,
    preview,
  }: {
    item: KnowledgeItem
    label: string
    preview?: string
  }) {
    const isSelected = selected.has(item.id)
    const isExpanded = expanded.has(item.id)
    return (
      <div className={cn('border-b border-gray-100 dark:border-[#382b61] last:border-0', isSelected && 'bg-[#f0ebff] dark:bg-[#2a1f4e]/40')}>
        <div className="flex items-center gap-2 px-3 py-2.5">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => toggleSelect(item.id)}
            className="h-3.5 w-3.5 cursor-pointer accent-[#6C47FF]"
          />
          <span
            className="flex-1 cursor-pointer truncate text-sm text-gray-700 dark:text-gray-300"
            onClick={() => preview !== undefined && toggleExpand(item.id)}
          >
            {label}
          </span>
          <div className="flex shrink-0 items-center gap-1">
            {preview !== undefined && (
              <button
                onClick={() => toggleExpand(item.id)}
                className="flex h-6 w-6 items-center justify-center rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-gray-400 hover:text-red-500"
              onClick={() => deleteItem(item.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        {isExpanded && preview && (
          <div className="border-t border-gray-100 dark:border-[#382b61] bg-gray-50 dark:bg-[#1A1035] px-4 py-3">
            <p className="whitespace-pre-wrap text-xs text-gray-600 dark:text-gray-400">{preview}</p>
          </div>
        )}
      </div>
    )
  }

  const selectedCount = selected.size

  return (
    <div className="space-y-6">
      {/* Bulk delete toolbar */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-[#6C47FF]/30 bg-[#f0ebff] dark:bg-[#2a1f4e] px-4 py-2.5">
          <span className="text-sm font-medium text-[#6C47FF]">
            {selectedCount} item{selectedCount > 1 ? 's' : ''} selected
          </span>
          <Button
            size="sm"
            variant="destructive"
            disabled={bulkDeleting}
            onClick={() => setConfirmBulkOpen(true)}
            className="h-7 gap-1.5 text-xs"
          >
            <Trash2 className="h-3 w-3" />
            {bulkDeleting ? 'Deleting…' : `Delete ${selectedCount}`}
          </Button>
        </div>
      )}

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">FAQs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAddFaq} className="space-y-3">
            <div className="space-y-1.5">
              <Label>Question</Label>
              <Input
                placeholder="What are your business hours?"
                value={faqForm.question}
                onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Answer</Label>
              <Textarea
                placeholder="We are open Monday to Friday, 8am–5pm GMT."
                value={faqForm.answer}
                onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                required
              />
            </div>
            <Button type="submit" size="sm" disabled={submitting === 'FAQ'}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              {submitting === 'FAQ' ? 'Adding...' : 'Add FAQ'}
            </Button>
          </form>

          {faqs.length > 0 && (
            <div>
              <div className="mb-1 flex items-center justify-between px-3">
                <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-500">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 accent-[#6C47FF]"
                    checked={faqs.every((i) => selected.has(i.id))}
                    onChange={() => selectAll(faqs)}
                  />
                  Select all
                </label>
                <span className="text-xs text-gray-400">{faqs.length} item{faqs.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="divide-y divide-gray-100 rounded-md border border-gray-200 dark:border-[#382b61]">
                {faqs.map((faq) => (
                  <ItemRow
                    key={faq.id}
                    item={faq}
                    label={faq.question ?? ''}
                    preview={faq.answer ?? undefined}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* PDFs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">PDFs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleUploadPdf} className="flex items-end gap-3">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="pdf-input">PDF file</Label>
              <Input
                id="pdf-input"
                type="file"
                accept=".pdf"
                onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <Button type="submit" size="sm" disabled={!pdfFile || submitting === 'PDF'}>
              {submitting === 'PDF' ? 'Uploading...' : 'Upload'}
            </Button>
          </form>

          {pdfs.length > 0 && (
            <div>
              <div className="mb-1 flex items-center justify-between px-3">
                <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-500">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 accent-[#6C47FF]"
                    checked={pdfs.every((i) => selected.has(i.id))}
                    onChange={() => selectAll(pdfs)}
                  />
                  Select all
                </label>
                <span className="text-xs text-gray-400">{pdfs.length} item{pdfs.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="divide-y divide-gray-100 rounded-md border border-gray-200 dark:border-[#382b61]">
                {pdfs.map((pdf) => (
                  <ItemRow
                    key={pdf.id}
                    item={pdf}
                    label={pdf.sourceUrl ?? ''}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* URLs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">URLs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAddUrl} className="flex items-end gap-3">
            <div className="flex-1 space-y-1.5">
              <Label>URL</Label>
              <Input
                type="url"
                placeholder="https://example.com/faq"
                value={urlForm.sourceUrl}
                onChange={(e) => setUrlForm({ sourceUrl: e.target.value })}
                required
              />
            </div>
            <Button type="submit" size="sm" disabled={submitting === 'URL'}>
              {submitting === 'URL' ? 'Adding...' : 'Add'}
            </Button>
          </form>

          {urls.length > 0 && (
            <div>
              <div className="mb-1 flex items-center justify-between px-3">
                <label className="flex cursor-pointer items-center gap-2 text-xs text-gray-500">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 accent-[#6C47FF]"
                    checked={urls.every((i) => selected.has(i.id))}
                    onChange={() => selectAll(urls)}
                  />
                  Select all
                </label>
                <span className="text-xs text-gray-400">{urls.length} item{urls.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="divide-y divide-gray-100 rounded-md border border-gray-200 dark:border-[#382b61]">
                {urls.map((url) => (
                  <ItemRow
                    key={url.id}
                    item={url}
                    label={url.sourceUrl ?? ''}
                    preview={url.rawText ? url.rawText.slice(0, 500) + (url.rawText.length > 500 ? '…' : '') : undefined}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmBulkOpen}
        onOpenChange={setConfirmBulkOpen}
        title={`Delete ${selectedCount} item${selectedCount > 1 ? 's' : ''}?`}
        description="These knowledge items will be permanently removed. Your bot will no longer use them to answer questions."
        confirmLabel={`Delete ${selectedCount} item${selectedCount > 1 ? 's' : ''}`}
        destructive
        loading={bulkDeleting}
        onConfirm={async () => {
          setConfirmBulkOpen(false)
          await bulkDelete()
        }}
      />
    </div>
  )
}
