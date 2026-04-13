import Link from 'next/link'
import { Check } from 'lucide-react'
import FloatingDots from './FloatingDots'
import { PLANS } from './data'

export default function PricingSection() {
  return (
    <section id="pricing" className="relative overflow-hidden bg-transparent py-28 ">
      <div className="absolute inset-0 opacity-10"><FloatingDots /></div>
      <div className="pointer-events-none absolute -top-20 -left-20 h-[500px] w-[500px] rounded-full bg-[#ead6ff] blur-[150px] opacity-40" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-20 text-center reveal">
          <span className="mb-3 inline-flex items-center rounded-full bg-white/60 dark:bg-[#111111]/60 border border-[#e2d5fa] dark:border-[#382b61] px-4 py-1.5 text-sm font-semibold text-[#8b5cf6] shadow-sm backdrop-blur-md">
            Simple Pricing
          </span>
          <h2 className="text-3xl font-bold text-[#1A1035] dark:text-white sm:text-4xl mt-2 tracking-tight">
            Transparent plans. Scale as you go.
          </h2>
          <p className="mt-4 text-lg text-[#6B6490] dark:text-white/60 font-medium">Start for free. Upgrade as your customer base expands.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan, i) => (
            <div
              key={plan.label}
              className={`reveal delay-${i * 100} relative flex flex-col rounded-[2rem] p-6 transition-transform hover:-translate-y-1 duration-300 ${
                plan.highlight
                  ? 'bg-gradient-to-b from-[#7e5bff] to-[#5a36e6] text-white shadow-2xl shadow-[#6C47FF]/30 border border-[#8a68ff]'
                  : 'bg-white/60 dark:bg-[#111111]/60 backdrop-blur-lg border border-[#e2d5fa] dark:border-[#382b61] shadow-[0_8px_30px_rgba(0,0,0,0.04)]'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-300 to-amber-400 px-4 py-1 text-xs font-bold text-amber-950 shadow-md border border-amber-200">
                  Most Popular
                </div>
              )}
              <div className={`mb-2 text-sm font-bold tracking-wide uppercase ${plan.highlight ? 'text-[#e5dcff]' : 'text-[#8b5cf6]'}`}>
                {plan.label}
              </div>
              <div className="mb-8 flex items-baseline gap-1.5">
                <span className={`text-3xl font-extrabold tracking-tight ${plan.highlight ? 'text-white' : 'text-[#1A1035] dark:text-white'}`}>
                  {plan.price}
                </span>
                <span className={`text-sm font-semibold ${plan.highlight ? 'text-[#dabdff]' : 'text-[#6B6490] dark:text-white/60'}`}>
                  {plan.priceNote}
                </span>
              </div>
              <ul className="flex-1 space-y-4 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className={`flex items-start gap-3 text-[14px] font-medium leading-snug ${plan.highlight ? 'text-white' : 'text-[#514972] dark:text-white/60'}`}>
                    <div className={`mt-0.5 rounded-full p-0.5 w-4 h-4 flex items-center justify-center shrink-0 ${plan.highlight ? 'bg-white/20 dark:bg-[#111111]/20' : 'bg-[#f4efff]'}`}>
                      <Check className={`h-3 w-3 ${plan.highlight ? 'text-white' : 'text-[#8b5cf6]'}`} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className={`w-full rounded-2xl py-3.5 text-center text-[15px] font-bold transition-all ${
                  plan.highlight
                    ? 'bg-white dark:bg-[#111111] text-[#6C47FF] hover:bg-[#f4efff] shadow-lg'
                    : 'bg-[#faf8ff] dark:bg-transparent border border-[#e2d5fa] text-[#1A1035] dark:text-white hover:bg-white dark:bg-[#111111] hover:border-[#cbc0e8] hover:shadow-md'
                }`}
              >
                {plan.label === 'Free' ? 'Start for free' : `Get ${plan.label}`}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
