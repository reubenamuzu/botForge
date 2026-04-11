import Link from 'next/link'
import { Check, ArrowRight, MessageSquare, Settings, Code2 } from 'lucide-react'

const PLANS = [
  {
    label: 'Free',
    price: 'GHS 0',
    priceNote: 'forever',
    features: ['1 bot', '50 messages / month', 'FAQ sources only', 'BotForge branding'],
  },
  {
    label: 'Starter',
    price: 'GHS 120',
    priceNote: '/ month',
    features: ['2 bots', '1,000 messages / month', 'All source types', 'No branding'],
    highlight: true,
  },
  {
    label: 'Pro',
    price: 'GHS 300',
    priceNote: '/ month',
    features: ['5 bots', '5,000 messages / month', 'All source types', 'WhatsApp integration'],
  },
  {
    label: 'Agency',
    price: 'GHS 700',
    priceNote: '/ month',
    features: ['Unlimited bots', '20,000 messages / month', 'All source types', 'White-label widget'],
  },
]

const STEPS = [
  {
    icon: MessageSquare,
    title: 'Add your FAQs',
    desc: 'Upload your frequently asked questions, paste URLs, or add PDFs. BotForge turns your content into AI knowledge instantly.',
  },
  {
    icon: Settings,
    title: 'Configure your bot',
    desc: 'Set your bot\'s name, personality, and fallback response. Make it sound exactly like your brand.',
  },
  {
    icon: Code2,
    title: 'Embed anywhere',
    desc: 'Copy one line of code and paste it into your website. Your AI support bot is live in seconds.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <header className="border-b border-gray-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-xl font-bold text-indigo-600">BotForge</span>
          <div className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <p className="mb-4 inline-block rounded-full bg-indigo-50 px-4 py-1 text-sm font-medium text-indigo-600">
          AI support for every business
        </p>
        <h1 className="mx-auto max-w-3xl text-5xl font-extrabold leading-tight tracking-tight text-gray-900">
          Build an AI support bot for your business in{' '}
          <span className="text-indigo-600">30 minutes</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-gray-500">
          No coding required. Train your bot on your existing content, embed it on your site,
          and let it handle customer questions around the clock.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/sign-up"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            Get started free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/sign-in"
            className="rounded-xl border border-gray-200 px-8 py-3.5 text-base font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50"
          >
            Sign in
          </Link>
        </div>
        <p className="mt-4 text-sm text-gray-400">Free forever — no credit card required</p>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-gray-900">How it works</h2>
            <p className="mt-3 text-gray-500">From setup to live in three simple steps.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="rounded-2xl bg-white p-8 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                  <Icon className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-400">STEP {i + 1}</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Simple, transparent pricing</h2>
            <p className="mt-3 text-gray-500">Start free. Upgrade as you grow.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((plan) => (
              <div
                key={plan.label}
                className={`relative flex flex-col rounded-2xl border p-6 ${
                  plan.highlight
                    ? 'border-indigo-500 shadow-lg ring-1 ring-indigo-500'
                    : 'border-gray-200'
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-0.5 text-xs font-semibold text-white">
                    Most popular
                  </span>
                )}
                <div className="mb-1 text-lg font-bold text-gray-900">{plan.label}</div>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-gray-900">{plan.price}</span>
                  <span className="text-sm text-gray-400">{plan.priceNote}</span>
                </div>
                <ul className="flex-1 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="h-4 w-4 shrink-0 text-indigo-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/sign-up"
                  className={`mt-8 block rounded-lg py-2.5 text-center text-sm font-semibold transition-colors ${
                    plan.highlight
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {plan.label === 'Free' ? 'Start for free' : `Get ${plan.label}`}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div>
              <span className="text-lg font-bold text-indigo-600">BotForge</span>
              <p className="mt-0.5 text-sm text-gray-400">
                AI support bots for every business
              </p>
            </div>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link href="/sign-in" className="hover:text-gray-900">
                Sign in
              </Link>
              <Link href="/sign-up" className="hover:text-gray-900">
                Get started
              </Link>
              <Link href="/dashboard/billing" className="hover:text-gray-900">
                Pricing
              </Link>
            </div>
          </div>
          <p className="mt-8 text-center text-xs text-gray-300">
            © {new Date().getFullYear()} BotForge. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
