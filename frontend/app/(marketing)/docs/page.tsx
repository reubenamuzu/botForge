import Link from 'next/link'
import { DOC_SECTIONS } from '@/lib/docs'
import { BookOpen, Boxes, Compass, CreditCard, MessageSquare, Plug, type LucideIcon } from 'lucide-react'

export default function DocsHomePage() {
  const featured = DOC_SECTIONS.flatMap((section) => section.items).map((item) => {
    const iconByHref: Record<string, LucideIcon> = {
      '/docs/getting-started': Compass,
      '/docs/knowledge-base': BookOpen,
      '/docs/embedding': Plug,
      '/docs/conversations': MessageSquare,
      '/docs/billing': CreditCard,
    }

    return {
      ...item,
      Icon: iconByHref[item.href] ?? Boxes,
    }
  })

  return (
    <div className="w-full space-y-10 pb-12">
      <section className="border-b border-[#ECECF1] pb-8 dark:border-white/[0.08]">
        <h1 className="text-3xl font-bold tracking-[-0.02em] text-[#1B1B1F] dark:text-[#F4F1FF]">
          Documentation
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#6D6D75] dark:text-[#8B82B0]">
          This site is designed to help you get the most out of the platform. Here, you&apos;ll find a collection of articles and tutorials covering all aspects of its features.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold tracking-[-0.02em] text-[#1B1B1F] dark:text-[#F4F1FF]">Good starting point</h2>
        <p className="mt-1 text-sm text-[#6D6D75] dark:text-[#8B82B0]">
          Everything you need to start using the platform quickly and efficiently.
        </p>
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featured.map(({ href, label, description, Icon }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-xl border border-[#E1E1E6] bg-white p-5 transition-colors hover:border-[#A6A6AF] dark:border-white/[0.08] dark:bg-[#15102E]"
            >
              <Icon className="h-4 w-4 text-[#5F5F68] dark:text-[#8B82B0]" />
              <h3 className="mt-4 text-base font-semibold leading-tight text-[#1B1B1F] dark:text-[#F4F1FF]">
                {label}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6D6D75] dark:text-[#8B82B0]">{description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="pt-2">
        <h2 className="text-2xl font-bold tracking-[-0.02em] text-[#1B1B1F] dark:text-[#F4F1FF]">Need help?</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#6D6D75] dark:text-[#8B82B0]">
          Have a question, need some help or advice, reach out to our support team. We&apos;re here to help!
        </p>
        <p className="mt-4 text-sm">
          <span className="font-semibold text-[#1B1B1F] dark:text-[#F4F1FF]">See:</span>{' '}
          <Link href="/docs/getting-started" className="font-semibold text-[#1B1B1F] underline dark:text-[#F4F1FF]">
            Getting Started
          </Link>
        </p>
      </section>
    </div>
  )
}
