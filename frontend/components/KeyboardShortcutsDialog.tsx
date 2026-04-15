'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Props {
  open: boolean
  onClose: () => void
}

const shortcuts = [
  { keys: ['⌘', 'K'], label: 'Open command palette' },
  { keys: ['⌘', 'B'], label: 'Collapse / expand sidebar' },
]

export function KeyboardShortcutsDialog({ open, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="mt-2 space-y-1">
          {shortcuts.map(({ keys, label }) => (
            <div key={label} className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-[#2d1f5e]">
              <span className="text-gray-600 dark:text-gray-300">{label}</span>
              <div className="flex items-center gap-1">
                {keys.map((k) => (
                  <kbd
                    key={k}
                    className="rounded border border-gray-200 dark:border-[#382b61] bg-gray-50 dark:bg-[#130b29] px-2 py-0.5 font-mono text-xs text-gray-500 dark:text-gray-400"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
