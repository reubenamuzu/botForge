'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

interface CodeBlockProps {
  code: string
  language?: string
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="relative my-6 rounded-lg overflow-hidden bg-gray-900">
      {language && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{language}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors"
            aria-label="Copy code"
          >
            {copied ? (
              <><Check className="h-3.5 w-3.5 text-green-400" /><span className="text-green-400">Copied!</span></>
            ) : (
              <><Copy className="h-3.5 w-3.5" />Copy</>
            )}
          </button>
        </div>
      )}
      {!language && (
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <><Check className="h-3.5 w-3.5 text-green-400" /><span className="text-green-400">Copied!</span></>
          ) : (
            <><Copy className="h-3.5 w-3.5" /></>
          )}
        </button>
      )}
      <pre className="p-4 text-sm font-mono text-green-400 overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  )
}
