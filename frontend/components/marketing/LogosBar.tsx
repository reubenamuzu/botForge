const LOGOS = ['SwiftKart Ghana']

export default function LogosBar() {
  return (
    <section className="relative border-y border-[#E8E3F5] dark:border-white/[0.08] bg-white dark:bg-[#15102E] px-8 py-8">
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(108,71,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(108,71,255,0.07) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
      <div className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-4">
        <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6B6490] dark:text-white/40">
          Trusted by
        </span>
        {LOGOS.map((name) => (
          <span
            key={name}
            className="text-[17px] font-bold tracking-[-0.01em] text-[#6B6490] dark:text-white/30"
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  )
}
