import { STATS } from './data'

export default function StatsSection() {
  return (
    <section className="relative z-20 overflow-hidden bg-[#faf8ff]/80 backdrop-blur-lg border-y border-white/60 py-14 shadow-sm">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {STATS.map(({ value, label }, i) => (
            <div key={label} className={`reveal delay-${i * 100} text-center`}>
              <p className="text-3xl font-extrabold text-[#6C47FF]">{value}</p>
              <p className="mt-1 text-sm font-medium text-[#6B6490]">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
