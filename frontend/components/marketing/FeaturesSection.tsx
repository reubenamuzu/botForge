const FEATURES = [
  { title: 'Train on anything',    desc: 'Upload FAQs, paste a help-center URL, or drop in PDFs. BotForge reads and learns from all of it.', tag: 'Any content' },
  { title: 'One line to embed',    desc: 'Copy a single script tag into your site. Works on Shopify, WordPress, or any custom HTML page.',    tag: 'No-code setup' },
  { title: 'Capture leads',        desc: 'Ask for a name or email before the chat starts. All contacts exported to CSV whenever you need.',   tag: 'Lead capture' },
  { title: 'See every conversation', desc: 'Every customer exchange is logged and threaded. Spot gaps in your answers and fix them fast.',    tag: 'Full history' },
  { title: 'Scales with you',      desc: 'Start free, upgrade as you grow. Bots, messages, and white-labeling gated cleanly by plan.',       tag: 'Flexible plans' },
  { title: 'Built for teams',      desc: 'Add teammates to help manage your bots. Set permissions, assign conversations, and collaborate. Coming soon!.', tag: 'Team access' },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="relative bg-[#F0EDFA] dark:bg-[#0A0518] px-8 py-28">
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(108,71,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(108,71,255,0.07) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
      <div className="relative mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E8E3F5] dark:border-white/10 bg-white dark:bg-white/5 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#4F35CC] dark:text-[#c9b1ff]">
              FEATURES
            </div>
            <h2 className="m-0 max-w-[600px] text-[42px] font-bold leading-[1.05] tracking-[-0.035em] text-[#1A1035] dark:text-[#F4F1FF] sm:text-[52px]">
              Everything you need.
              <br />
              <span className="font-normal italic text-[#6B6490] dark:text-[#8B82B0]"
                style={{ fontFamily: 'var(--font-instrument-serif), "Instrument Serif", Georgia, serif' }}>
                Nothing you don&rsquo;t.
              </span>
            </h2>
          </div>
          <p className="max-w-[340px] text-[15px] leading-[1.6] text-[#6B6490] dark:text-[#8B82B0]">
            We did the hard work — vector search, RAG, billing, embed — so you can focus on writing better answers.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[20px] border border-[#E8E3F5] dark:border-white/[0.08] bg-[#E8E3F5] dark:bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="min-h-[200px] bg-white dark:bg-[#15102E] p-8">
              <div className="mb-4 inline-block rounded-md border border-[#E8E3F5] dark:border-white/10 bg-[#F5F3FF] dark:bg-white/5 px-2 py-0.5 text-[11px] font-semibold text-[#4F35CC] dark:text-[#c9b1ff]">
                {f.tag}
              </div>
              <h3 className="mb-2 mt-0 text-[19px] font-bold tracking-[-0.015em] text-[#1A1035] dark:text-[#F4F1FF]">
                {f.title}
              </h3>
              <p className="m-0 text-[14px] leading-[1.55] text-[#6B6490] dark:text-[#8B82B0]">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
