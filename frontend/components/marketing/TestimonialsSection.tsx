import { Star } from 'lucide-react'
import { TESTIMONIALS, DOT_GRID } from './data'

export default function TestimonialsSection() {
  return (
    <section id="customers" className="relative overflow-hidden bg-[#f4efff] py-28 border-t border-white/50">
      <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: DOT_GRID, backgroundSize: '28px 28px' }} />
      <div className="pointer-events-none absolute -top-40 right-[-10%] h-[600px] w-[600px] rounded-full bg-[#ecdfff] blur-[140px] opacity-60" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center reveal">
          <span className="mb-3 inline-flex items-center rounded-full bg-white/60 border border-white px-4 py-1.5 text-sm font-semibold text-[#8b5cf6] shadow-sm backdrop-blur-md">
            Customer stories
          </span>
          <h2 className="text-3xl font-bold text-[#1A1035] sm:text-4xl mt-2 tracking-tight">
            Trusted by growing businesses
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {TESTIMONIALS.map(({ name, role, company, avatar, color, text, stars }, i) => (
            <div
              key={name}
              className={`reveal delay-${i * 150} flex flex-col rounded-3xl border border-white/80 bg-white/50 backdrop-blur-xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all duration-300`}
            >
              <div className="mb-5 flex gap-1">
                {Array.from({ length: stars }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="flex-1 text-[15px] font-medium leading-relaxed text-[#514972]">&ldquo;{text}&rdquo;</p>
              <div className="mt-8 flex items-center gap-4 border-t border-white/60 pt-6">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${color} shadow-inner text-base font-bold text-white`}>
                  {avatar}
                </div>
                <div>
                  <p className="text-[15px] font-bold text-[#1A1035]">{name}</p>
                  <p className="text-xs font-semibold text-[#8b5cf6]">{role} · {company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
