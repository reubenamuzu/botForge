import Link from 'next/link'
import { ChevronsUp, ArrowUpRight } from 'lucide-react'

export default function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#8a68ff] via-[#7e5bff] to-[#5a36e6] py-32 rounded-[3rem] mx-4 sm:mx-8 mb-8 mt-12 shadow-2xl shadow-[#6C47FF]/20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-10 right-10 h-64 w-64 rounded-full border border-white/20" />
        <div className="absolute -bottom-10 left-10 h-72 w-72 rounded-full border border-white/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl opacity-50" />
      </div>

      <div className="reveal relative mx-auto max-w-3xl px-6 text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-3xl bg-white/10 border border-white/20 backdrop-blur-md mb-8">
          <ChevronsUp className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Ready to automate your support?
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg font-medium text-purple-100">
          Join hundreds of visionary businesses using BotForge to deliver instant, accurate answers — day and night.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row justify-center">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-[#6C47FF] hover:bg-[#f4efff] transition-all hover:scale-105 shadow-xl shadow-black/10"
          >
            Get started for free <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <p className="mt-6 text-sm font-medium text-purple-200/80">No credit card required. Cancel anytime.</p>
      </div>
    </section>
  )
}
