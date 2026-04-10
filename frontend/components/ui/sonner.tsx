'use client'

import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: 'group toast bg-white border border-gray-200 shadow-lg text-gray-900',
          description: 'text-gray-500',
          actionButton: 'bg-indigo-600 text-white',
          cancelButton: 'bg-gray-100 text-gray-700',
        },
      }}
      {...props}
    />
  )
}
