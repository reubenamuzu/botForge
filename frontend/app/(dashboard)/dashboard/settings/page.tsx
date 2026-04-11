'use client'

import { useState } from 'react'
import { useAuth, useUser, useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your account.</p>
      </div>

      <div className="max-w-xl space-y-6">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Full name</Label>
              <Input value={user?.fullName ?? ''} disabled className="bg-gray-50" />
            </div>
            <div className="space-y-1.5">
              <Label>Email address</Label>
              <Input
                value={user?.primaryEmailAddress?.emailAddress ?? ''}
                disabled
                className="bg-gray-50"
              />
            </div>
            <p className="text-xs text-gray-400">
              To update your name or email, visit your{' '}
              <a
                href="https://accounts.clerk.com/user"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                Clerk account settings
              </a>
              .
            </p>
          </CardContent>
        </Card>

        {/* Danger zone */}
        <Card className="border-red-100">
          <CardHeader>
            <CardTitle className="text-base text-red-600">Danger zone</CardTitle>
          </CardHeader>
          <CardContent>
            {!confirm ? (
              <div>
                <p className="mb-4 text-sm text-gray-600">
                  Delete your BotForge account and all associated bots, knowledge bases, and
                  conversation data. Your account will be{' '}
                  <strong>permanently removed after a 30-day grace period</strong>. You will
                  be signed out immediately.
                </p>
                <Button
                  variant="outline"
                  className="border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50"
                  onClick={() => setConfirm(true)}
                >
                  Delete account…
                </Button>
              </div>
            ) : (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="mb-4 text-sm font-medium text-red-800">
                  Are you absolutely sure? This action schedules deletion of all your data
                  in 30 days and signs you out immediately.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={deleting}
                    onClick={() => setConfirm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    disabled={deleting}
                    onClick={handleDelete}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    {deleting ? 'Deleting…' : 'Yes, delete my account'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
