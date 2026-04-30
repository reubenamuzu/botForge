import Link from 'next/link'

const PLANS = [
  { label: 'Free',    price: 'GHS 0',   note: 'forever', features: ['1 bot', '50 messages / month','FAQ sources only','BotForge branding'],                         highlight: false },
  { label: 'Starter', price: 'GHS 120', note: '/ month',    features: ['2 bots', '1,000 messages / month','All sources types', 'No branding'],                        highlight: false },
  { label: 'Pro',     price: 'GHS 300', note: '/ month',    features: ['5 bots', '5,000 messages / month', 'All source types', 'WhatsApp integration - Coming soon!'], highlight: true  },
  { label: 'Agency',  price: 'GHS 700', note: '/ month',    features: ['Unlimited bots', '20,000 messages / month', 'Priority support','All source types','White-label widget'], highlight: false },
]

export default function PricingSection() {
  return (
    <section id="pricing" className="relative bg-[#F8F8FF] dark:bg-[#0E0820] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(108,71,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(108,71,255,0.07) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
      <div className="relative mx-auto max-w-7xl text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E8E3F5] dark:border-white/10 bg-white dark:bg-white/5 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#4F35CC] dark:text-[#c9b1ff]">
          PRICING
        </div>
        <h2 className="mx-auto mt-5 max-w-[640px] text-[34px] font-bold leading-[1.05] tracking-[-0.035em] text-[#1A1035] dark:text-[#F4F1FF] sm:text-[52px]">
          Pay for usage,
          <br />
            <span className="font-mono font-medium text-[#6C47FF] dark:text-[#8B6FFF] text-[26px] sm:text-[40px]">
              not promises.
            </span>
        </h2>
        <p className="mx-auto mt-4 mb-14 max-w-[420px] text-[15px] leading-[1.6] text-[#6B6490] dark:text-[#8B82B0]">
          Start free. Upgrade when your messages outgrow you.
        </p>

        <div className="grid grid-cols-1 gap-3 text-left sm:grid-cols-2 xl:grid-cols-4">
          {PLANS.map((p) => (
            <div key={p.label} className={`relative rounded-2xl p-6 ${
              p.highlight
                ? 'bg-[#1A1035] dark:bg-white/[0.07] border border-[#1A1035] dark:border-white/20'
                : 'border border-[#E8E3F5] dark:border-white/[0.08] bg-white dark:bg-[#15102E]'
            }`}>
              {p.highlight && (
                <div className="absolute -top-3 right-4 rounded-full bg-[#6C47FF] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.06em] text-white">
                  popular
                </div>
              )}

              <div className={`font-mono text-[11px] font-bold uppercase tracking-[0.08em] ${p.highlight ? 'text-[#c9b1ff]' : 'text-[#6C47FF] dark:text-[#8B6FFF]'}`}>
                {p.label}
              </div>

              <div className="mt-3 flex items-baseline gap-1.5">
                <span className={`text-[28px] font-bold tracking-[-0.03em] ${p.highlight ? 'text-white' : 'text-[#1A1035] dark:text-[#F4F1FF]'}`}>
                  {p.price}
                </span>
                <span className={`font-mono text-[12px] ${p.highlight ? 'text-[#a09bb8]' : 'text-[#6B6490] dark:text-[#8B82B0]'}`}>
                  {p.note}
                </span>
              </div>

              <div className={`my-4 h-px ${p.highlight ? 'bg-white/10' : 'bg-[#E8E3F5] dark:bg-white/[0.08]'}`} />

              <ul className="mb-6 flex flex-col gap-2">
                {p.features.map((f) => (
                  <li key={f} className={`flex items-center gap-2 font-mono text-[13px] ${p.highlight ? 'text-[#dcd1ff]' : 'text-[#3D3163] dark:text-[#D7D0F0]'}`}>
                    <span className={p.highlight ? 'text-[#7CFFB2]' : 'text-[#6C47FF] dark:text-[#8B6FFF]'}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link href="/sign-up" className={`block w-full rounded-lg py-2.5 text-center text-[14px] font-semibold transition-opacity hover:opacity-80 ${
                p.highlight
                  ? 'bg-[#6C47FF] text-white'
                  : 'border border-[#E8E3F5] dark:border-white/10 bg-[#F8F8FF] dark:bg-white/5 text-[#1A1035] dark:text-[#F4F1FF]'
              }`}>
                {p.label === 'Free' ? 'Start free' : `Get ${p.label}`}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
