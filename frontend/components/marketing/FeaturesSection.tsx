import FloatingDots from './FloatingDots'
import { FEATURES, MESH_GRID } from './data'

export default function FeaturesSection() {
  return (
    <section id="features" className="relative overflow-hidden bg-transparent py-24">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: MESH_GRID, backgroundSize: '16px 16px' }} />
      <div className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-[#ecdfff] blur-[120px] opacity-60" />
      <div className="pointer-events-none absolute top-1/2 right-[-10%] h-[500px] w-[500px] rounded-full bg-[#faefff] blur-[120px] opacity-50" />
      <FloatingDots className="top-8 right-8 w-72 opacity-50 text-[#8a68ff]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center reveal">
          <span className="mb-3 inline-flex items-center rounded-full bg-white/60 dark:bg-[#111111]/60 border border-[#e2d5fa] dark:border-[#382b61] px-4 py-1.5 text-sm font-semibold text-[#8b5cf6] shadow-sm backdrop-blur-md">
            Everything you need
          </span>
          <h2 className="text-3xl font-bold text-[#1A1035] dark:text-white sm:text-4xl mt-2 tracking-tight">
            Built for businesses that move fast
          </h2>
          <p className="mt-4 text-lg text-[#6B6490] dark:text-white/60 font-medium">
            All the tools to deploy, train, and grow your AI support operation.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, desc, color }, i) => (
            <div
              key={title}
              className={`reveal delay-${Math.min(i * 100, 500)} rounded-3xl border border-[#e2d5fa] dark:border-[#382b61] bg-white/50 dark:bg-[#111111]/50 backdrop-blur-xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(100,50,200,0.08)] hover:-translate-y-1 transition-all duration-300`}
            >
              <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${color} shadow-lg shadow-[#1A1035]/10`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-3 text-lg font-bold text-[#1A1035] dark:text-white">{title}</h3>
              <p className="text-[15px] leading-relaxed font-medium text-[#6B6490] dark:text-white/60">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
