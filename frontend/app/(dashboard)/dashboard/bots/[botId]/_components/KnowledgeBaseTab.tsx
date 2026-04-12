'use client'

import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Trash2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import type { KnowledgeItem, KnowledgeType } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

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

  const faqs = items.filter((i) => i.type === 'FAQ')
  const pdfs = items.filter((i) => i.type === 'PDF')
  const urls = items.filter((i) => i.type === 'URL')

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
      toast.success('Deleted')
    } catch {
      toast.error('Failed to delete')
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

  return (
    <div className="space-y-6">
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
            <div className="divide-y divide-gray-100 rounded-md border border-gray-200">
              {faqs.map((faq) => (
                <div key={faq.id} className="flex items-center justify-between px-3 py-2.5">
                  <span className="truncate text-sm text-gray-700">{faq.question}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-gray-400 hover:text-red-500"
                    onClick={() => deleteItem(faq.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
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
            <div className="divide-y divide-gray-100 rounded-md border border-gray-200">
              {pdfs.map((pdf) => (
                <div key={pdf.id} className="flex items-center justify-between px-3 py-2.5">
                  <span className="truncate text-sm text-gray-700">{pdf.sourceUrl}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-gray-400 hover:text-red-500"
                    onClick={() => deleteItem(pdf.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
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
            <div className="divide-y divide-gray-100 rounded-md border border-gray-200">
              {urls.map((url) => (
                <div key={url.id} className="flex items-center justify-between px-3 py-2.5">
                  <span className="truncate text-sm text-[#6C47FF]">{url.sourceUrl}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-gray-400 hover:text-red-500"
                    onClick={() => deleteItem(url.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
