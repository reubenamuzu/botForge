import Link from 'next/link'

const STEPS = [
  {
    n: '01',
    title: 'Train it on your content',
    desc: 'Upload your FAQs, paste your help center URL, or drop in PDFs. BotForge reads everything and learns how to answer your customers.',
    code: null,
  },
  {
    n: '02',
    title: 'Add it to your website',
    desc: 'Copy one line of code into your site — no developer needed for most platforms. The chat widget appears automatically.',
    code: '<script src="…/widget.js"\n  data-bot-id="your-bot-id"></script>',
  },
  {
    n: '03',
    title: 'Watch it handle questions',
    desc: 'Customers get instant answers around the clock. You see every conversation in your dashboard and can improve responses anytime.',
    code: null,
  },
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative bg-[#F8F8FF] dark:bg-[#0E0820] px-8 py-28">
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(108,71,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(108,71,255,0.07) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E8E3F5] dark:border-white/10 bg-white dark:bg-white/5 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#4F35CC] dark:text-[#c9b1ff]">
          HOW IT WORKS
        </div>

        <h2 className="m-0 mb-14 max-w-[620px] text-[44px] font-bold leading-[1.05] tracking-[-0.035em] text-[#1A1035] dark:text-[#F4F1FF] sm:text-[52px]">
          From zero to live in{' '}
          <span style={{ fontFamily: 'var(--font-instrument-serif), "Instrument Serif", Georgia, serif' }}
            className="font-normal italic text-[#6C47FF] dark:text-[#8B6FFF]">
            three steps.
          </span>
        </h2>

        <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.n} className="relative rounded-2xl border border-[#E8E3F5] dark:border-white/[0.08] bg-white dark:bg-[#15102E] p-8">
              <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F5F3FF] dark:bg-white/5 font-mono text-[12px] font-bold text-[#6C47FF] dark:text-[#8B6FFF]">
                {s.n}
              </div>
              <h3 className="mb-2 text-[20px] font-bold tracking-[-0.02em] text-[#1A1035] dark:text-[#F4F1FF]">
                {s.title}
              </h3>
              <p className="text-[14px] leading-[1.6] text-[#6B6490] dark:text-[#8B82B0]">
                {s.desc}
              </p>
              {s.code && (
                <pre className="mt-5 whitespace-pre-wrap rounded-lg border border-white/10 bg-[#0E0820] px-4 py-3 font-mono text-[11px] leading-[1.7] text-[#E8E0FF]">
                  {s.code}
                </pre>
              )}
              {i < 2 && (
                <div className="absolute -right-3 top-10 hidden h-px w-6 bg-[#E8E3F5] dark:bg-white/10 sm:block" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-12">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-lg bg-[#6C47FF] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(108,71,255,0.5)] transition-opacity hover:opacity-90"
          >
            Build your bot now →
          </Link>
        </div>
      </div>
    </section>
  )
}
