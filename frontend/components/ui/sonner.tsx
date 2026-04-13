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
          toast: 'group toast bg-white dark:bg-[#1A1035] border border-gray-200 dark:border-[#382b61] shadow-lg text-gray-900 dark:text-gray-100',
          description: 'text-gray-500 dark:text-gray-400',
          actionButton: 'bg-indigo-600 text-white',
          cancelButton: 'bg-gray-100 text-gray-700 dark:text-gray-300',
        },
      }}
      {...props}
    />
  )
}
