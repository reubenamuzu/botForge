const TESTIMONIALS = [
  {
    quote: 'Replaced 60% of our support tickets in the first week. The team got their evenings back.',
    author: 'Akosua M.',
    role: 'Founder · StyleKart',
  },
  {
    quote: 'We embed it in client sites. Setup is genuinely 30 minutes. Our retainer margins thank us.',
    author: 'Kwame B.',
    role: 'Director · Mobalsoft',
  },
  {
    quote: "The Claude backend means answers don't read like canned bot replies. Customers don't notice.",
    author: 'Linda O.',
    role: 'Head of Ops · AccraEats',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="relative bg-[#F0EDFA] dark:bg-[#0A0518] px-8 py-28">
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(108,71,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(108,71,255,0.07) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E8E3F5] dark:border-white/10 bg-white dark:bg-white/5 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#4F35CC] dark:text-[#c9b1ff]">
          TESTIMONIALS
        </div>
        <h2 className="mb-14 mt-5 max-w-[600px] text-[42px] font-bold leading-[1.05] tracking-[-0.035em] text-[#1A1035] dark:text-[#F4F1FF]">
          Teams using BotForge<br />in production.
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.author} className="flex flex-col rounded-2xl border border-[#E8E3F5] dark:border-white/[0.08] bg-white dark:bg-[#15102E] p-7">
              <span className="mb-3 font-mono text-[18px] text-[#6C47FF] dark:text-[#8B6FFF]">&ldquo;</span>
              <p className="m-0 flex-1 text-[16px] font-medium leading-[1.55] text-[#1A1035] dark:text-[#F4F1FF]">
                {t.quote}
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-[#E8E3F5] dark:border-white/[0.08] pt-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E8E3F5] dark:border-white/10 bg-[#F5F3FF] dark:bg-white/5 font-bold text-[13px] text-[#4F35CC] dark:text-[#c9b1ff]">
                  {t.author[0]}
                </div>
                <div>
                  <div className="text-[13px] font-bold text-[#1A1035] dark:text-[#F4F1FF]">{t.author}</div>
                  <div className="font-mono text-[11px] text-[#6B6490] dark:text-[#8B82B0]">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
