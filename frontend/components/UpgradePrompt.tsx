import Link from 'next/link'
import { Zap } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

interface UpgradePromptProps {
  message?: string
}

export function UpgradePrompt({
  message = "You've reached your plan limit.",
}: UpgradePromptProps) {
  return (
    <Alert className="border-indigo-200 bg-indigo-50">
      <Zap className="h-4 w-4 text-indigo-600" />
      <AlertTitle className="text-indigo-900">Plan limit reached</AlertTitle>
      <AlertDescription className="mt-1 flex items-center justify-between gap-4">
        <span className="text-indigo-700">{message}</span>
        <Button asChild size="sm" className="shrink-0 bg-indigo-600 hover:bg-indigo-700">
          <Link href="/dashboard/billing">Upgrade now</Link>
        </Button>
      </AlertDescription>
    </Alert>
  )
}
