import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { STEPS } from './data'

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-gradient-to-b from-[#faf8ff] to-[#f4efff] py-24">
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-[#dabdff] blur-[140px] opacity-30" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full border border-white/50" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full border border-white/40" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-20 text-center reveal">
          <span className="mb-3 inline-flex items-center rounded-full bg-white/60 border border-white px-4 py-1.5 text-sm font-semibold text-[#8b5cf6] shadow-sm backdrop-blur-md">
            Simple process
          </span>
          <h2 className="text-3xl font-bold text-[#1A1035] sm:text-4xl mt-2 tracking-tight">
            From setup to live in 3 steps
          </h2>
          <p className="mt-4 text-lg text-[#6B6490] font-medium">No technical skills required.</p>
        </div>

        <div className="grid gap-10 sm:grid-cols-3 relative">
          {/* Connector line */}
          <div className="hidden sm:block absolute top-[44px] left-[15%] w-[70%] h-[2px] bg-gradient-to-r from-transparent via-[#dabdff] to-transparent opacity-50" />

          {STEPS.map(({ icon: Icon, title, desc, step }, i) => (
            <div key={i} className={`reveal delay-${i * 200} flex flex-col items-center text-center relative z-10`}>
              <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border-2 border-white bg-white/60 backdrop-blur-lg shadow-[0_12px_40px_rgba(100,50,200,0.1)]">
                <Icon className="h-10 w-10 text-[#6C47FF]" />
                <span className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#8a68ff] to-[#6C47FF] shadow-md border-2 border-white text-xs font-bold text-white">
                  {step}
                </span>
              </div>
              <h3 className="mb-3 text-xl font-bold text-[#1A1035]">{title}</h3>
              <p className="text-[15px] font-medium leading-relaxed text-[#6B6490] max-w-[280px]">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-full bg-[#1A1035] hover:bg-[#2d1b54] transition-colors px-10 py-4 text-base font-bold text-white shadow-xl shadow-[#1A1035]/20 hover:scale-105 transform duration-200"
          >
            Build your bot now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
