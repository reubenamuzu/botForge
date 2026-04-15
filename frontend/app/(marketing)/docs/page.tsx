import Link from 'next/link'
import { DOC_SECTIONS } from '@/lib/docs'

export default function DocsHomePage() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-[#1A1035] dark:text-white mb-3">
          BotForge Documentation
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
          Everything you need to build, train, and deploy AI-powered chat bots for your business — no coding required.
        </p>
      </div>

      <div className="space-y-10">
        {DOC_SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-4">
              {section.title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative rounded-xl border border-gray-200 dark:border-[#2d1f5e] bg-white dark:bg-[#1A1035]/60 p-5 hover:border-[#6C47FF] hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-[#1A1035] dark:text-white group-hover:text-[#6C47FF] transition-colors">
                      {item.label}
                    </h3>
                    {item.href === '/docs/getting-started' && (
                      <span className="shrink-0 inline-flex items-center rounded-full bg-[#6C47FF] px-2 py-0.5 text-xs font-medium text-white">
                        Start here
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                  <span className="mt-3 inline-flex items-center text-xs font-medium text-[#6C47FF] group-hover:gap-1 transition-all">
                    Read more →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
