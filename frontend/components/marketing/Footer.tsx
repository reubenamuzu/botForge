import Link from 'next/link'
import { Logo } from '@/components/Logo'

const COLS = [
  {
    heading: 'Product',
    links: [
      { label: 'Features',      href: '#features' },
      { label: 'Pricing',       href: '#pricing' },
      { label: 'How it works',  href: '#how-it-works' },
      { label: 'Changelog',     href: '/docs' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Embed guide',   href: '/docs' },
      { label: 'API reference', href: '/docs' },
      { label: 'Status',        href: '#' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About',         href: '#' },
      { label: 'Privacy',       href: '/privacy' },
      { label: 'Terms',         href: '/terms' },
      { label: 'Contact',       href: '#' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-[#E8E3F5] dark:border-white/[0.08] bg-[#F8F8FF] dark:bg-[#0E0820] px-4 pb-8 pt-12 sm:px-6 sm:pt-16 lg:px-8">
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(108,71,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(108,71,255,0.07) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
      <div className="relative mx-auto grid max-w-7xl grid-cols-3 gap-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-12">
        {/* Brand */}
        <div className="col-span-3 lg:col-span-1">
          <div className="flex items-center gap-2">
            <Logo size={22} />
            <span className="text-[16px] font-bold tracking-[-0.02em] text-[#1A1035] dark:text-[#F4F1FF]">BotForge</span>
          </div>
          <p className="mt-4 max-w-[260px] text-[13px] leading-[1.6] text-[#6B6490] dark:text-[#8B82B0]">
            AI-powered support bots for every business. Engage customers, automate FAQs, and boost satisfaction with ease.
          </p>
        </div>

        {/* Link columns */}
        {COLS.map((col) => (
          <div key={col.heading}>
            <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[#6B6490] dark:text-white/40">
              {col.heading}
            </div>
            <ul className="flex flex-col gap-2.5">
              {col.links.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[13px] text-[#1A1035] dark:text-[#8B82B0] transition-colors hover:text-[#6C47FF] dark:hover:text-[#8B6FFF]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-2 border-t border-[#E8E3F5] pt-6 font-mono text-[12px] text-[#6B6490] dark:border-white/[0.08] dark:text-[#8B82B0] sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 BotForge</span>
        <span>
          v1.0 · status:{' '}
          <span className="text-[#22A06B] dark:text-[#7CFFB2]">● operational</span>
        </span>
      </div>
    </footer>
  )
}
