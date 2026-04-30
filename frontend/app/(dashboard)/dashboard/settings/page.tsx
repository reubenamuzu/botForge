'use client'

import { useState } from 'react'
import { useAuth, useUser, useClerk } from '@clerk/nextjs'
import { ThemeToggle } from '@/components/theme-toggle'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const gridStyle = {
  backgroundImage:
    'linear-gradient(rgba(108,71,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(108,71,255,0.07) 1px, transparent 1px)',
  backgroundSize: '64px 64px',
}

export default function SettingsPage() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const { getToken } = useAuth()
  const router = useRouter()
  const [confirm, setConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      const token = await getToken()
      // Soft-delete in our DB (30-day grace)
      await api.delete('/users/me', { headers: { Authorization: `Bearer ${token}` } })
      // Remove from Clerk immediately so they can't log back in
      await user?.delete()
      await signOut()
      router.push('/')
    } catch {
      toast.error('Failed to delete account. Please try again.')
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page header strip */}
      <div className="relative -mx-3 -mt-3 mb-6 overflow-hidden border-b border-[#E8E3F5] bg-[#F8F8FF] px-4 py-6 dark:border-white/[0.08] dark:bg-[#0E0820] sm:-mx-6 sm:-mt-6 sm:mb-8 sm:px-8 sm:py-8 lg:-mx-8 lg:-mt-8">
        <div className="pointer-events-none absolute inset-0" style={gridStyle} />
        <div className="relative">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#E8E3F5] dark:border-white/10 bg-white dark:bg-white/5 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#4F35CC] dark:text-[#c9b1ff]">
            SETTINGS
          </div>
          <h1 className="text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-[#1A1035] dark:text-[#F4F1FF] sm:text-[32px]">
            Account{' '}
            <em style={{ fontFamily: 'var(--font-instrument-serif)', fontStyle: 'italic', fontWeight: 400 }}>
              Settings.
            </em>
          </h1>
          <p className="mt-2 font-mono text-[12px] text-[#6B6490] dark:text-[#8B82B0]">
            Manage your account preferences.
          </p>
        </div>
      </div>

      <div className="max-w-xl space-y-5 sm:space-y-6">
        {/* Profile */}
        <div className="rounded-2xl border border-[#E8E3F5] dark:border-white/[0.08] bg-white dark:bg-[#15102E] p-6">
          <div className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#6B6490] dark:text-[#8B82B0]">
            Profile
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Full name</Label>
              <Input
                value={user?.fullName ?? ''}
                disabled
                className="border-[#E8E3F5] dark:border-white/[0.08] bg-[#F8F8FF] dark:bg-white/5"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Email address</Label>
              <Input
                value={user?.primaryEmailAddress?.emailAddress ?? ''}
                disabled
                className="border-[#E8E3F5] dark:border-white/[0.08] bg-[#F8F8FF] dark:bg-white/5"
              />
            </div>
            <p className="text-xs text-[#6B6490] dark:text-[#8B82B0]">
              To update your name or email, visit your{' '}
              <a
                href="https://accounts.clerk.com/user"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6C47FF] hover:underline"
              >
                Clerk account settings
              </a>
              .
            </p>
          </div>
        </div>

        {/* Appearance */}
        <div className="rounded-2xl border border-[#E8E3F5] dark:border-white/[0.08] bg-white dark:bg-[#15102E] p-6">
          <div className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#6B6490] dark:text-[#8B82B0]">
            Appearance
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#1A1035] dark:text-[#F4F1FF]">Theme</p>
              <p className="mt-0.5 text-xs text-[#6B6490] dark:text-[#8B82B0]">Switch between light and dark mode.</p>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Danger zone */}
        <div className="rounded-2xl border border-red-200 dark:border-red-900/30 bg-white dark:bg-[#15102E] p-6">
          <div className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-red-500">
            Danger Zone
          </div>
          {!confirm ? (
            <div>
              <p className="mb-4 text-sm text-[#6B6490] dark:text-[#8B82B0]">
                Delete your BotForge account and all associated bots, knowledge bases, and
                conversation data. Your account will be{' '}
                <strong className="text-[#1A1035] dark:text-[#F4F1FF]">permanently removed after a 30-day grace period</strong>. You will
                be signed out immediately.
              </p>
              <button
                onClick={() => setConfirm(true)}
                className="rounded-xl border border-red-200 dark:border-red-900/30 bg-white dark:bg-white/5 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Delete account…
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 p-4">
              <p className="mb-4 text-sm font-medium text-red-800 dark:text-red-300">
                Are you absolutely sure? This action schedules deletion of all your data
                in 30 days and signs you out immediately.
              </p>
              <div className="flex gap-3">
                <button
                  disabled={deleting}
                  onClick={() => setConfirm(false)}
                  className="rounded-xl border border-[#E8E3F5] dark:border-white/[0.08] bg-white dark:bg-white/5 px-4 py-2 text-sm font-semibold text-[#1A1035] dark:text-[#F4F1FF] transition-colors hover:border-[#6C47FF] disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  disabled={deleting}
                  onClick={handleDelete}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
                >
                  {deleting ? 'Deleting…' : 'Yes, delete my account'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
