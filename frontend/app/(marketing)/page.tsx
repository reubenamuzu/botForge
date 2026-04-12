'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import {
  Check,
  ArrowRight,
  MessageSquare,
  Settings,
  Code2,
  Zap,
  Globe,
  Bot,
  ShieldCheck,
  Star,
  Users,
  TrendingUp,
  BarChart3,
  ChevronRight,
} from 'lucide-react'

/* ─── data ─────────────────────────────────────────────────── */

const PLANS = [
  {
    label: 'Free',
    price: 'GHS 0',
    priceNote: 'forever',
    features: ['1 bot', '50 messages / month', 'FAQ sources only', 'BotForge branding'],
    highlight: false,
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
    highlight: false,
  },
  {
    label: 'Agency',
    price: 'GHS 700',
    priceNote: '/ month',
    features: ['Unlimited bots', '20,000 messages / month', 'All source types', 'White-label widget'],
    highlight: false,
  },
]

const FEATURES = [
  {
    icon: Zap,
    title: 'Instant Setup',
    desc: 'Go from zero to a live AI support bot in under 30 minutes — no developers needed.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Globe,
    title: 'Embed Anywhere',
    desc: 'One line of code deploys your bot to any website, landing page, or web app.',
    color: 'from-sky-500 to-blue-600',
  },
  {
    icon: Bot,
    title: 'Train on Your Content',
    desc: 'Upload PDFs, paste URLs, or write FAQs — your bot learns your business instantly.',
    color: 'from-[#6C47FF] to-[#4F35CC]',
  },
  {
    icon: ShieldCheck,
    title: 'Always On',
    desc: 'Your AI agent works 24/7, handling customer questions while you focus on growth.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    desc: 'Track conversations, capture leads, and understand what your customers need.',
    color: 'from-pink-500 to-rose-600',
  },
  {
    icon: Users,
    title: 'Lead Capture',
    desc: 'Automatically collect visitor details and grow your customer list effortlessly.',
    color: 'from-[#6C47FF] to-purple-600',
  },
]

const STEPS = [
  {
    icon: MessageSquare,
    title: 'Add your content',
    desc: 'Upload FAQs, paste URLs, or add PDFs. BotForge turns your content into AI knowledge instantly.',
    step: '01',
  },
  {
    icon: Settings,
    title: 'Configure your bot',
    desc: "Set your bot's name, personality, and fallback response. Make it sound exactly like your brand.",
    step: '02',
  },
  {
    icon: Code2,
    title: 'Embed anywhere',
    desc: 'Copy one line of code and paste it into your website. Your AI support bot goes live in seconds.',
    step: '03',
  },
]

const TESTIMONIALS = [
  {
    name: 'Ama Asante',
    role: 'E-commerce Owner',
    company: 'Kente Store GH',
    avatar: 'AA',
    color: 'bg-[#6C47FF]',
    text: 'BotForge cut our support emails by 60% in the first week. Customers get instant answers and our team focuses on what matters.',
    stars: 5,
  },
  {
    name: 'Kwame Mensah',
    role: 'Founder',
    company: 'TechBridge Africa',
    avatar: 'KM',
    color: 'bg-[#4F35CC]',
    text: 'Setup took literally 20 minutes. We trained the bot on our docs and it handles onboarding questions better than we expected.',
    stars: 5,
  },
  {
    name: 'Abena Osei',
    role: 'Digital Agency Lead',
    company: 'Pixel Wave Studio',
    avatar: 'AO',
    color: 'bg-emerald-600',
    text: 'The white-label feature is a game changer. We deploy branded bots for all our clients under the Agency plan. Incredible ROI.',
    stars: 5,
  },
]

const STATS = [
  { value: '10,000+', label: 'Messages handled daily' },
  { value: '500+', label: 'Active businesses' },
  { value: '30 min', label: 'Average setup time' },
  { value: '99.9%', label: 'Uptime guarantee' },
]

/* ─── SVG / decoration helpers ──────────────────────────────── */

const DOT_GRID = `url("data:image/svg+xml,%3Csvg width='28' height='28' viewBox='0 0 28 28' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23D9D3F0' fill-opacity='0.7'/%3E%3C/svg%3E")`
const LINE_GRID = `url("data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h48v1H0zM0 0v48h1V0z' fill='%23EDE8FF' fill-opacity='0.8'/%3E%3C/svg%3E")`

function HexGrid() {
  return (
    <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <pattern id="hex" x="0" y="0" width="56" height="48" patternUnits="userSpaceOnUse">
          <polygon points="14,2 42,2 56,24 42,46 14,46 0,24" fill="none" stroke="#D9D3F0" strokeWidth="0.8" strokeOpacity="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hex)" />
    </svg>
  )
}

function FloatingDots({ className = '' }: { className?: string }) {
  const dots = [
    { cx: 40, cy: 40, r: 4 }, { cx: 120, cy: 20, r: 6 },
    { cx: 200, cy: 60, r: 3 }, { cx: 80, cy: 100, r: 5 },
    { cx: 160, cy: 130, r: 4 }, { cx: 260, cy: 30, r: 5 },
    { cx: 300, cy: 110, r: 3 }, { cx: 20, cy: 160, r: 6 },
  ]
  return (
    <svg className={`pointer-events-none absolute ${className}`} viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill="#6C47FF" fillOpacity="0.18" />
      ))}
    </svg>
  )
}

/* ─── Phone mockup component ─────────────────────────────────── */

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-64 sm:w-72">
      {/* Purple glow behind phone */}
      <div className="absolute -inset-6 rounded-full bg-[#6C47FF]/15 blur-3xl" />

      {/* Phone frame */}
      <div className="relative mx-auto w-64 sm:w-72 rounded-[2.5rem] border-[6px] border-[#1A1035] bg-[#1A1035] shadow-2xl">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#1A1035] rounded-b-2xl z-10" />

        {/* Screen */}
        <div className="relative rounded-[2rem] overflow-hidden bg-[#F5F3FF] min-h-[520px]">
          {/* Chat header */}
          <div className="flex items-center gap-2.5 bg-[#6C47FF] px-4 pt-8 pb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white">BF</div>
            <div>
              <p className="text-xs font-semibold text-white">BotForge AI</p>
              <p className="text-[10px] text-purple-200">● Online · Always ready</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex flex-col gap-3 p-4 pt-3">
            {/* Bot */}
            <div className="flex gap-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#6C47FF] text-[9px] font-bold text-white">BF</div>
              <div className="max-w-[78%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-[11px] leading-relaxed text-[#1A1035] shadow-sm">
                👋 Hi! How can I assist you today?
              </div>
            </div>

            {/* User */}
            <div className="flex justify-end">
              <div className="max-w-[78%] rounded-2xl rounded-tr-sm bg-[#6C47FF] px-3 py-2 text-[11px] text-white">
                What plans do you offer?
              </div>
            </div>

            {/* Bot */}
            <div className="flex gap-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#6C47FF] text-[9px] font-bold text-white">BF</div>
              <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-[11px] leading-relaxed text-[#1A1035] shadow-sm">
                We have 4 plans from <span className="font-semibold text-[#6C47FF]">GHS 0/mo</span>. The Starter at GHS 120 is most popular!
              </div>
            </div>

            {/* User */}
            <div className="flex justify-end">
              <div className="max-w-[78%] rounded-2xl rounded-tr-sm bg-[#6C47FF] px-3 py-2 text-[11px] text-white">
                How do I get started?
              </div>
            </div>

            {/* Bot */}
            <div className="flex gap-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#6C47FF] text-[9px] font-bold text-white">BF</div>
              <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-[11px] leading-relaxed text-[#1A1035] shadow-sm">
                Sign up free, add your content, then copy one line of code to go live! 🚀
              </div>
            </div>

            {/* Typing */}
            <div className="flex gap-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#6C47FF] text-[9px] font-bold text-white">BF</div>
              <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-white px-3 py-2 shadow-sm">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#6C47FF] [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#6C47FF] [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#6C47FF] [animation-delay:300ms]" />
              </div>
            </div>
          </div>

          {/* Input bar */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-[#EDE8FF] bg-white p-3">
            <div className="flex items-center gap-2 rounded-xl border border-[#D9D3F0] bg-[#F5F3FF] px-3 py-2">
              <span className="flex-1 text-[11px] text-[#6B6490]">Type a message…</span>
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#6C47FF]">
                <ArrowRight className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live badge */}
      <div className="absolute -top-2 -right-2 flex items-center gap-1.5 rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-md">
        <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
        Live
      </div>
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────────── */

export default function LandingPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.12 }
    )
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const { isSignedIn, isLoaded } = useUser()

  return (
    <div className="min-h-screen bg-ghost text-[#1A1035] antialiased">

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-[#EDE8FF] bg-[#F8F8FF]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-[#6C47FF] tracking-tight">
            BotForge
          </Link>
          <nav className="hidden items-center gap-8 sm:flex">
            {(['features', 'how-it-works', 'pricing'] as const).map((id) => (
              <a key={id} href={`#${id}`} className="text-sm font-medium capitalize text-[#6B6490] hover:text-[#6C47FF] transition-colors">
                {id.replace('-', ' ')}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {isLoaded && isSignedIn ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium text-[#6B6490] hover:text-[#1A1035] transition-colors">
                  Dashboard
                </Link>
                <UserButton />
              </>
            ) : (
              <>
                <Link href="/sign-in" className="text-sm font-medium text-[#6B6490] hover:text-[#1A1035] transition-colors">
                  Sign in
                </Link>
                <Link href="/sign-up" className="flex items-center gap-1.5 rounded-lg bg-[#6C47FF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#5D3BE8] transition-colors">
                  Get started <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#F5F3FF]">
        {/* Dot-grid background */}
        <div className="absolute inset-0" style={{ backgroundImage: DOT_GRID, backgroundSize: '28px 28px' }} />

        {/* Large decorative blobs */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-[#6C47FF]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-0 h-[350px] w-[350px] rounded-full bg-[#6C47FF]/8 blur-3xl" />

        {/* Thin rings */}
        <div className="pointer-events-none absolute top-16 right-40 h-48 w-48 rounded-full border border-[#D9D3F0]" />
        <div className="pointer-events-none absolute top-24 right-48 h-28 w-28 rounded-full border border-[#D9D3F0]/60" />
        <div className="pointer-events-none absolute bottom-20 left-1/3 h-64 w-64 rounded-full border border-[#D9D3F0]/50" />

        <FloatingDots className="top-8 left-8 w-80 opacity-80" />

        <div className="relative mx-auto max-w-6xl px-6 py-24 lg:py-32">
          <div className="grid items-center gap-16 lg:grid-cols-2">

            {/* ── Left: copy ── */}
            <div className="reveal-left">
              {/* Badge */}
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D9D3F0] bg-white px-4 py-1.5 text-sm font-medium text-[#6C47FF] shadow-sm">
                <Zap className="h-3.5 w-3.5" />
                AI-Powered Customer Support
              </span>

              {/* Headline */}
              <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight text-[#1A1035] sm:text-6xl">
                Build an AI
                <br />
                <span className="text-[#6C47FF]">Support Bot</span>
                <br />
                for your Business
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-[#6B6490]">
                No coding required. Train your bot on your content, embed it on your site, and let AI handle customer questions around the clock.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/sign-up"
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#6C47FF] px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#6C47FF]/30 hover:bg-[#5D3BE8] transition-colors"
                >
                  Get started free <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#how-it-works"
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#D9D3F0] bg-white px-7 py-3.5 text-base font-semibold text-[#1A1035] hover:bg-[#EDE8FF] transition-colors"
                >
                  See how it works
                </a>
              </div>
              <p className="mt-4 text-sm text-[#6B6490]">Free forever · No credit card required</p>

              {/* Trust row */}
              <div className="mt-8 flex items-center gap-4 border-t border-[#EDE8FF] pt-6">
                <div className="flex -space-x-2">
                  {['AA', 'KM', 'AO', 'BB'].map((init, i) => (
                    <div key={i} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#6C47FF] text-[10px] font-bold text-white" style={{ zIndex: 4 - i }}>
                      {init}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-[#6B6490]">Loved by 500+ businesses</p>
                </div>
              </div>
            </div>

            {/* ── Right: phone mockup ── */}
            <div className="reveal-right flex justify-center lg:justify-end">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ────────────────────────────────────────── */}
      <section className="border-y border-[#EDE8FF] bg-white py-14">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {STATS.map(({ value, label }, i) => (
              <div key={label} className={`reveal text-center delay-${i * 100}`}>
                <p className="text-3xl font-extrabold text-[#6C47FF]">{value}</p>
                <p className="mt-1 text-sm text-[#6B6490]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────── */}
      <section id="features" className="relative overflow-hidden py-24">
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: LINE_GRID, backgroundSize: '48px 48px' }} />
        <div className="pointer-events-none absolute -top-32 -left-32 h-[400px] w-[400px] rounded-full bg-[#6C47FF]/8 blur-3xl" />
        <FloatingDots className="top-8 right-8 w-72 opacity-50" />

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center reveal">
            <span className="mb-3 inline-block rounded-full bg-[#EDE8FF] px-4 py-1 text-sm font-medium text-[#6C47FF]">
              Everything you need
            </span>
            <h2 className="text-3xl font-bold text-[#1A1035] sm:text-4xl">
              Built for businesses that move fast
            </h2>
            <p className="mt-4 text-lg text-[#6B6490]">
              All the tools to deploy, train, and grow your AI support operation.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, desc, color }, i) => (
              <div key={title} className={`reveal delay-${Math.min(i * 100, 500)} rounded-2xl border border-[#EDE8FF] bg-white p-7 shadow-sm hover:shadow-md hover:border-[#D9D3F0] transition-all`}>
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-[#1A1035]">{title}</h3>
                <p className="text-sm leading-relaxed text-[#6B6490]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────── */}
      <section id="how-it-works" className="relative overflow-hidden bg-[#F5F3FF] py-24">
        <div className="absolute inset-0 opacity-40"><HexGrid /></div>
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-[400px] w-[400px] rounded-full bg-[#6C47FF]/10 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full border border-[#D9D3F0]/60" />

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center reveal">
            <span className="mb-3 inline-block rounded-full bg-[#EDE8FF] px-4 py-1 text-sm font-medium text-[#6C47FF]">
              Simple process
            </span>
            <h2 className="text-3xl font-bold text-[#1A1035] sm:text-4xl">
              From setup to live in 3 steps
            </h2>
            <p className="mt-4 text-lg text-[#6B6490]">No technical skills required.</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, desc, step }, i) => (
              <div key={i} className={`reveal delay-${i * 200} flex flex-col items-center text-center`}>
                <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-[#D9D3F0] bg-white shadow-md">
                  <Icon className="h-8 w-8 text-[#6C47FF]" />
                  <span className="absolute -top-2.5 -right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#6C47FF] text-xs font-bold text-white">
                    {step}
                  </span>
                </div>
                <h3 className="mb-3 text-lg font-semibold text-[#1A1035]">{title}</h3>
                <p className="text-sm leading-relaxed text-[#6B6490]">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center reveal">
            <Link href="/sign-up" className="inline-flex items-center gap-2 rounded-xl bg-[#6C47FF] px-8 py-3.5 text-base font-semibold text-white hover:bg-[#5D3BE8] transition-colors shadow-lg shadow-[#6C47FF]/25">
              Build your bot now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ghost py-24">
        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: DOT_GRID, backgroundSize: '28px 28px' }} />
        <FloatingDots className="top-6 right-6 w-72 opacity-40" />

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center reveal">
            <span className="mb-3 inline-block rounded-full bg-[#EDE8FF] px-4 py-1 text-sm font-medium text-[#6C47FF]">
              Customer stories
            </span>
            <h2 className="text-3xl font-bold text-[#1A1035] sm:text-4xl">
              Trusted by growing businesses
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map(({ name, role, company, avatar, color, text, stars }, i) => (
              <div key={name} className={`reveal delay-${i * 150} flex flex-col rounded-2xl border border-[#EDE8FF] bg-white p-7 shadow-sm`}>
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: stars }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="flex-1 text-sm leading-relaxed text-[#6B6490]">&ldquo;{text}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3 border-t border-[#F5F3FF] pt-5">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${color} text-sm font-bold text-white`}>
                    {avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1A1035]">{name}</p>
                    <p className="text-xs text-[#6B6490]">{role} · {company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ────────────────────────────────────────────── */}
      <section id="pricing" className="relative overflow-hidden bg-white py-24">
        <div className="absolute inset-0 opacity-40"><HexGrid /></div>
        <div className="pointer-events-none absolute -top-20 -right-20 h-[350px] w-[350px] rounded-full bg-[#6C47FF]/8 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center reveal">
            <span className="mb-3 inline-block rounded-full bg-[#EDE8FF] px-4 py-1 text-sm font-medium text-[#6C47FF]">
              Pricing
            </span>
            <h2 className="text-3xl font-bold text-[#1A1035] sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-[#6B6490]">Start free. Upgrade as you grow.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PLANS.map((plan, i) => (
              <div key={plan.label} className={`reveal delay-${i * 100} relative flex flex-col rounded-2xl p-7 ${
                plan.highlight
                  ? 'bg-[#6C47FF] text-white shadow-xl shadow-[#6C47FF]/30'
                  : 'bg-white border border-[#EDE8FF] shadow-sm'
              }`}>
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-3 py-0.5 text-xs font-bold text-amber-900">
                    Most popular
                  </span>
                )}
                <div className={`mb-1 text-sm font-semibold uppercase tracking-wide ${plan.highlight ? 'text-purple-200' : 'text-[#6C47FF]'}`}>
                  {plan.label}
                </div>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className={`text-3xl font-extrabold ${plan.highlight ? 'text-white' : 'text-[#1A1035]'}`}>{plan.price}</span>
                  <span className={`text-sm ${plan.highlight ? 'text-purple-200' : 'text-[#6B6490]'}`}>{plan.priceNote}</span>
                </div>
                <ul className="flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2.5 text-sm ${plan.highlight ? 'text-purple-100' : 'text-[#6B6490]'}`}>
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${plan.highlight ? 'text-purple-200' : 'text-[#6C47FF]'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/sign-up" className={`mt-8 block rounded-xl py-2.5 text-center text-sm font-semibold transition-colors ${
                  plan.highlight
                    ? 'bg-white text-[#6C47FF] hover:bg-[#EDE8FF]'
                    : 'border border-[#EDE8FF] text-[#1A1035] hover:bg-[#F5F3FF]'
                }`}>
                  {plan.label === 'Free' ? 'Start for free' : `Get ${plan.label}`}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#6C47FF] py-24">
        <div className="pointer-events-none absolute inset-0">
          <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <defs>
              <pattern id="cta-hex" x="0" y="0" width="56" height="48" patternUnits="userSpaceOnUse">
                <polygon points="14,2 42,2 56,24 42,46 14,46 0,24" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-hex)" />
          </svg>
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/5" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full border border-white/10" />
        </div>
        <div className="relative mx-auto max-w-3xl px-6 text-center reveal">
          <TrendingUp className="mx-auto mb-6 h-12 w-12 text-purple-200" />
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to automate your customer support?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-purple-200">
            Join hundreds of businesses using BotForge to deliver instant, accurate answers to their customers — day and night.
          </p>
          <Link href="/sign-up" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-[#6C47FF] hover:bg-[#EDE8FF] transition-colors shadow-xl">
            Get started for free <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-4 text-sm text-purple-200">No credit card · Cancel anytime</p>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="relative overflow-hidden border-t border-[#EDE8FF] bg-white py-16">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: DOT_GRID, backgroundSize: '28px 28px' }} />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link href="/" className="text-lg font-bold text-[#6C47FF] tracking-tight">BotForge</Link>
              <p className="mt-3 text-sm leading-relaxed text-[#6B6490]">
                AI support bots for every business. Built for Africa, ready for the world.
              </p>
            </div>
            <div>
              <p className="mb-4 text-sm font-semibold text-[#1A1035]">Product</p>
              <ul className="space-y-2.5">
                <li><a href="#features" className="text-sm text-[#6B6490] hover:text-[#6C47FF] transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-sm text-[#6B6490] hover:text-[#6C47FF] transition-colors">Pricing</a></li>
                <li><a href="#how-it-works" className="text-sm text-[#6B6490] hover:text-[#6C47FF] transition-colors">How it works</a></li>
              </ul>
            </div>
            <div>
              <p className="mb-4 text-sm font-semibold text-[#1A1035]">Account</p>
              <ul className="space-y-2.5">
                <li><Link href="/sign-in" className="text-sm text-[#6B6490] hover:text-[#6C47FF] transition-colors">Sign in</Link></li>
                <li><Link href="/sign-up" className="text-sm text-[#6B6490] hover:text-[#6C47FF] transition-colors">Create account</Link></li>
                <li><Link href="/dashboard" className="text-sm text-[#6B6490] hover:text-[#6C47FF] transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-4 text-sm font-semibold text-[#1A1035]">Legal</p>
              <ul className="space-y-2.5">
                <li><Link href="/privacy" className="text-sm text-[#6B6490] hover:text-[#6C47FF] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-sm text-[#6B6490] hover:text-[#6C47FF] transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#EDE8FF] pt-8 sm:flex-row">
            <p className="text-xs text-[#6B6490]">© {new Date().getFullYear()} BotForge. All rights reserved.</p>
            <p className="text-xs text-[#6B6490]">Made with ❤️ for African businesses</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
