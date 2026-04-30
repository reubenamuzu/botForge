'use client'

import { useState } from 'react'

const FAQS = [
  {
    q: 'How long does setup actually take?',
    a: 'Genuinely under 30 minutes for a basic bot. Paste your help-center URL, we scrape and embed in seconds. The rest is testing and tuning the answers.',
  },
  {
    q: 'Which AI model does it use?',
    a: 'Claude Haiku 4.5 by default — optimised for speed (1.2s p50). We retrieval-augment with your knowledge base so it stays accurate to your content.',
  },
  {
    q: 'What if customers ask something outside the knowledge base?',
    a: 'The bot says so politely and offers to connect to a human. You configure the fallback in the dashboard — email, WhatsApp, or live chat handover.',
  },
  {
    q: 'Can I white-label it?',
    a: "Yes, on the Agency plan. Remove 'Powered by BotForge', use your own domain for the widget, and apply a custom theme.",
  },
  {
    q: 'Do you support languages other than English?',
    a: 'Yes — Twi, French, Swahili, Yoruba, plus any language Claude supports. The bot detects and responds in the customer\'s language automatically.',
  },
  {
    q: 'Is there an API?',
    a: 'Yes — REST + webhooks. Useful if you want to surface answers inside your own app rather than through the widget.',
  },
]

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="relative bg-[#F8F8FF] dark:bg-[#0E0820] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(108,71,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(108,71,255,0.07) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
      <div className="relative mx-auto max-w-[820px]">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E8E3F5] dark:border-white/10 bg-white dark:bg-white/5 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#4F35CC] dark:text-[#c9b1ff]">
          FAQ
        </div>
        <h2 className="mb-10 mt-5 text-[34px] font-bold leading-[1.05] tracking-[-0.035em] text-[#1A1035] dark:text-[#F4F1FF] sm:text-[42px]">
          Frequently asked.
        </h2>

        <div className="flex flex-col gap-2">
          {FAQS.map((f, i) => {
            const isOpen = open === i
            return (
              <button
                key={i}
                onClick={() => setOpen(isOpen ? null : i)}
                className="rounded-xl border border-[#E8E3F5] dark:border-white/[0.08] bg-white dark:bg-[#15102E] px-6 py-5 text-left transition-colors hover:border-[#D8D1ED] dark:hover:border-white/20"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-[#6C47FF] dark:text-[#8B6FFF]">
                      Q.{String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[16px] font-semibold text-[#1A1035] dark:text-[#F4F1FF]">
                      {f.q}
                    </span>
                  </div>
                  <span
                    className="shrink-0 font-mono text-[20px] text-[#6B6490] dark:text-[#8B82B0] transition-transform duration-200"
                    style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}
                  >
                    +
                  </span>
                </div>
                {isOpen && (
                  <p className="mb-0 mt-3 pl-0 text-[14px] leading-[1.6] text-[#6B6490] dark:text-[#8B82B0] sm:pl-[52px]">
                    {f.a}
                  </p>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
