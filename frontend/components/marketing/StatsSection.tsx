const STATS = [
  ['5+', 'businesses using BotForge'],
  ['< 2s',   'average response time'],
  ['91%',    'questions auto-answered'],
  ['30 min', 'average setup time'],
  ['1m+',   'messages handled'],
  ['99.99%', 'uptime'],
]

export default function StatsSection() {
  return (
    <section className="relative border-y border-[#E8E3F5] dark:border-white/[0.08] bg-[#F8F8FF] dark:bg-[#0E0820] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(108,71,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(108,71,255,0.07) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
        {STATS.map(([n, label]) => (
          <div key={label}>
            <div className="font-mono text-[32px] font-bold leading-none tracking-[-0.03em] text-[#1A1035] dark:text-[#F4F1FF]">
              {n}
            </div>
            <div className="mt-2 font-mono text-[11px] tracking-[0.04em] text-[#6B6490] dark:text-[#8B82B0]">
              {label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
