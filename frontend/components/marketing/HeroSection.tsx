import Link from 'next/link'
import { type ReactNode } from 'react'
import { Sparkles, ArrowUpRight, ArrowRight, Mic, ChevronsUp, Bot } from 'lucide-react'
import { MESH_GRID } from './data'

/* ─── Phone frame ────────────────────────────────────────────── */

function PhoneFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative rounded-[2.8rem] border-[7px] border-[#1C1C1E] bg-[#1C1C1E] shadow-2xl shadow-black/25 ${className}`}>
      {/* Volume buttons */}
      <div className="absolute -left-[9px] top-[84px] w-[3px] h-7 bg-[#3A3A3C] rounded-l-full" />
      <div className="absolute -left-[9px] top-[120px] w-[3px] h-7 bg-[#3A3A3C] rounded-l-full" />
      {/* Power button */}
      <div className="absolute -right-[9px] top-[100px] w-[3px] h-14 bg-[#3A3A3C] rounded-r-full" />
      {/* Screen */}
      <div className="rounded-[2.2rem] overflow-hidden relative bg-white dark:bg-[#111111] h-full">
        {/* Dynamic island */}
        <div className="absolute top-0 left-0 w-full flex justify-center items-center pt-3 pb-0 z-50">
          <div className="w-[88px] h-[26px] bg-black rounded-full ring-1 ring-[#2C2C2E]" />
        </div>
        {children}
      </div>
    </div>
  )
}

/* ─── Two phone mockup ───────────────────────────────────────── */

function TwoPhoneMockup() {
  return (
    <div className="relative mx-auto flex items-end justify-center w-full max-w-4xl h-[560px] md:h-[650px] mt-2">

      {/* Floating card — top left */}
      <div className="absolute top-[20%] left-[5%] md:left-[10%] z-30 flex animate-bounce [animation-duration:4s] items-center gap-3 rounded-2xl border border-[#e2d5fa] dark:border-[#382b61]/60 bg-white/60 dark:bg-[#111111]/60 backdrop-blur-md px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4ebff] shadow-sm border border-[#e2d5fa] dark:border-[#382b61]/40">
          <Mic className="h-5 w-5 text-[#9a70ff]" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-sm font-bold text-[#1A1035] dark:text-white">Answers on the go.</span>
          <span className="text-xs font-semibold text-[#6B6490] dark:text-white/60">Just speak up.</span>
        </div>
      </div>

      {/* Floating card — bottom left */}
      <div className="absolute bottom-[20%] left-[5%] md:left-[8%] z-30 flex animate-bounce [animation-duration:5s] items-center gap-4 rounded-[2rem] border border-[#e2d5fa] dark:border-[#382b61]/60 bg-white/70 dark:bg-[#111111]/70 backdrop-blur-xl px-5 py-3 shadow-[0_8px_32px_rgba(100,50,250,0.1)]">
        <div className="flex h-8 w-8 items-center justify-center">
          <span className="font-serif italic font-bold text-xl text-[#3b2d63]">zA</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-12 h-3.5 bg-[#1A1035] rounded-full" />
          <div className="w-3.5 h-3.5 bg-[#1A1035] rounded-full" />
        </div>
      </div>

      {/* Floating card — top right (waveform) */}
      <div className="absolute top-[35%] right-[2%] md:right-[5%] z-30 flex animate-bounce [animation-duration:4.5s] items-center gap-3 rounded-full border border-[#e2d5fa] dark:border-[#382b61]/60 bg-[#eedcff]/60 backdrop-blur-md pl-2 pr-6 py-2 shadow-xl shadow-purple-200/40">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1A1035] text-white shadow-sm">
          <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-1" />
        </div>
        <div className="flex items-center gap-[3px]">
          {[4, 8, 12, 18, 24, 14, 18, 10, 6, 12, 28, 18, 12, 8, 4, 10, 6, 4].map((h, i) => (
            <div key={i} className="w-[3px] bg-[#2d1b54] rounded-full opacity-40" style={{ height: `${h}px` }} />
          ))}
        </div>
      </div>

      {/* Floating card — bottom right */}
      <div className="absolute bottom-[25%] right-[5%] md:right-[12%] z-30 flex animate-bounce [animation-duration:3.5s] flex-col items-center justify-center rounded-2xl border border-[#e2d5fa] dark:border-[#382b61]/60 bg-white/60 dark:bg-[#111111]/60 backdrop-blur-md p-4 shadow-[0_12px_24px_rgba(150,100,250,0.15)]">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-[#111111] shadow-sm mb-3">
          <ChevronsUp className="h-5 w-5 text-[#1A1035] dark:text-white" />
        </div>
        <span className="text-xs font-bold text-[#1A1035] dark:text-white text-center">High-speed<br />processing</span>
      </div>

      {/* Right phone — BotForge Dashboard (behind) */}
      <div className="absolute right-[15%] md:right-[25%] bottom-10 z-10 w-[220px] md:w-[260px] h-[450px] md:h-[530px]">
        <PhoneFrame className="w-full h-full shadow-2xl scale-95 origin-bottom">
          <div className="flex flex-col bg-white dark:bg-[#111111] h-full">
            <div className="border-b border-[#F5F3FF] bg-white dark:bg-[#111111] px-4 pt-12 pb-4 shrink-0">
              <p className="text-xs font-bold text-[#1A1035] dark:text-white">BotForge Dashboard</p>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] text-emerald-600 font-medium">Bot is live</p>
              </div>
            </div>
            <div className="p-3 space-y-3 flex-1 overflow-hidden">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-[#F5F3FF] dark:bg-[#1A1A1A] p-2.5">
                  <p className="text-[10px] text-[#6B6490] dark:text-white/60">Messages</p>
                  <p className="text-lg font-extrabold text-[#6C47FF]">3.4k</p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-2.5">
                  <p className="text-[10px] text-[#6B6490] dark:text-white/60">Resolved</p>
                  <p className="text-lg font-extrabold text-emerald-600">91%</p>
                </div>
              </div>
              <div className="rounded-xl bg-[#F5F3FF] dark:bg-[#1A1A1A] p-3">
                <p className="text-[10px] font-semibold text-[#6B6490] dark:text-white/60 mb-2">Recent conversations</p>
                {['Shipping to Kumasi', 'Return policy', 'Size guide'].map((item) => (
                  <div key={item} className="flex items-center justify-between py-1.5 border-b border-[#EDE8FF] last:border-0">
                    <p className="text-[10px] text-[#1A1035] dark:text-white">{item}</p>
                    <span className="text-[9px] rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700 font-medium">Resolved</span>
                  </div>
                ))}
              </div>
              <div className="rounded-xl bg-[#6C47FF] p-3 flex items-center gap-2">
                <Bot className="h-5 w-5 text-white shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold text-white">AI handling queries</p>
                  <p className="text-[9px] text-purple-200">24/7 — no downtime</p>
                </div>
              </div>
            </div>
          </div>
        </PhoneFrame>
      </div>

      {/* Left phone — StyleKart Chat UI (front) */}
      <div className="absolute left-[15%] md:left-[25%] bottom-0 z-20 w-[230px] md:w-[280px] h-[470px] md:h-[560px]">
        <PhoneFrame className="w-full h-full shadow-[-20px_0_60px_rgba(100,50,200,0.25)]">
          <div className="flex flex-col bg-[#F5F3FF] dark:bg-[#1A1A1A] h-full">
            <div className="flex items-center gap-2.5 bg-[#6C47FF] px-4 pt-12 pb-4 shrink-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 dark:bg-[#111111]/20 text-xs font-bold text-white">SK</div>
              <div>
                <p className="text-xs font-semibold text-white">StyleKart Support</p>
                <p className="text-[10px] text-purple-200">● Powered by BotForge</p>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-3 p-3 overflow-hidden">
              <div className="flex gap-2">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#6C47FF] text-[9px] font-bold text-white">SK</div>
                <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white dark:bg-[#111111] px-3 py-2 text-[11px] leading-relaxed text-[#1A1035] dark:text-white shadow-sm">
                  Hi! 👗 Welcome to StyleKart. How can I help?
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-[#6C47FF] px-3 py-2 text-[11px] text-white">
                  Do you ship to Kumasi?
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#6C47FF] text-[9px] font-bold text-white">SK</div>
                <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white dark:bg-[#111111] px-3 py-2 text-[11px] leading-relaxed text-[#1A1035] dark:text-white shadow-sm">
                  Yes! 🚚 Standard 2-3 days, express is next-day!
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-[#6C47FF] px-3 py-2 text-[11px] text-white">
                  What&apos;s your return policy?
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#6C47FF] text-[9px] font-bold text-white">SK</div>
                <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-white dark:bg-[#111111] px-3 py-2 shadow-sm">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#6C47FF] [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#6C47FF] [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#6C47FF] [animation-delay:300ms]" />
                </div>
              </div>
            </div>
            <div className="border-t border-[#EDE8FF] bg-white dark:bg-[#111111] p-3 shrink-0">
              <div className="flex items-center gap-2 rounded-xl border border-[#D9D3F0] dark:border-[#e2d5fa] dark:border-[#382b61]/10 bg-[#F5F3FF] dark:bg-[#1A1A1A] px-3 py-2">
                <span className="flex-1 text-[11px] text-[#6B6490] dark:text-white/60">Type a message…</span>
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#6C47FF] shrink-0">
                  <ArrowRight className="h-3 w-3 text-white" />
                </div>
              </div>
            </div>
          </div>
        </PhoneFrame>
      </div>
    </div>
  )
}

/* ─── Hero section ───────────────────────────────────────────── */

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-transparent pb-10 min-h-screen flex items-center pt-20 md:pt-10">
      {/* Aurora cloud background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex items-center justify-center">
        <div className="absolute top-[-10%] left-[-5%] h-[600px] w-[800px] rounded-[100%] bg-[#ecdfff] dark:bg-[#ecdfff] blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-50 dark:opacity-[0.03] dark:scale-50 animate-aurora-1" />
        <div className="absolute top-[10%] right-[-10%] h-[800px] w-[800px] rounded-[100%] bg-[#ead6ff] dark:bg-[#ead6ff] blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-60 dark:opacity-[0.03] dark:scale-50 animate-aurora-2" />
        <div className="absolute top-[30%] left-[20%] h-[600px] w-[800px] rounded-[100%] bg-[#fff0f8] dark:bg-[#fff0f8] blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-60 dark:opacity-[0.03] dark:scale-50 animate-aurora-3" />
        <div className="absolute bottom-[-10%] left-[0%] h-[700px] w-[900px] rounded-[100%] bg-[#e3d6f5] dark:bg-[#e3d6f5] blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-40 dark:opacity-[0.03] dark:scale-50 animate-aurora-4" />
      </div>

      {/* Mesh grid overlay */}
      <div
        className="absolute inset-0 z-0 opacity-10 pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: MESH_GRID, backgroundSize: '16px 16px' }}
      />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-6 text-center z-10 pt-16">

        {/* Badge */}
        <div
          className="hero-in mb-8 mt-12 sm:mt-16 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d1bcf5]/40 to-[#e2d5fa]/40 px-3.5 py-1.5 text-xs font-semibold text-[#8b5cf6] shadow-sm ring-1 ring-white/60 backdrop-blur-md"
          style={{ animationDelay: '0ms' }}
        >
          {/* <Sparkles className="h-3.5 w-3.5 text-[#8b5cf6]" /> */}
          🤖 AI-Powered Customer Support Platform
        </div>

        {/* Headline */}
        <h1
          className="hero-in max-w-4xl text-2xl font-bold leading-[1.2] tracking-tight text-[#1A1035] dark:text-white sm:text-3xl lg:text-[4rem] lg:leading-[1.15]"
          style={{ animationDelay: '100ms' }}
        >
          AI Support That Works While
          <br />
          You Scale Your Business.
        </h1>

        {/* Subtitle */}
        <p
          className="hero-in mt-6 max-w-[500px] text-base font-normal leading-relaxed text-[#6B6490] dark:text-white/60"
          style={{ animationDelay: '200ms' }}
        >
          Train your bot on your content, embed it anywhere, and let AI handle customer questions around the clock — no coding required.
        </p>

        {/* CTAs */}
        <div
          className="hero-in mt-8 flex flex-col gap-4 sm:flex-row"
          style={{ animationDelay: '300ms' }}
        >
          <Link
            href="/sign-up"
            className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#dcd1ff] to-[#ccb5ff] dark:from-[#6C47FF] dark:to-[#4F35CC] hover:from-[#d1c1fa] hover:to-[#be98fc] dark:hover:from-[#7c5bff] dark:hover:to-[#5D3BE8] px-8 py-3.5 text-base font-semibold text-[#1A1035] dark:text-white shadow-lg shadow-purple-900/10 dark:shadow-purple-900/40 transition-all hover:scale-105"
          >
            Get started free <ArrowUpRight className="h-4 w-4" />
          </Link>
          <a
            href="#how-it-works"
            className="flex items-center justify-center gap-2 rounded-full border border-[#f0eaff] dark:border-[#382b61] bg-white/70 dark:bg-black/40 backdrop-blur-md px-8 py-3.5 text-base font-semibold text-[#1A1035] dark:text-white shadow-sm hover:bg-white dark:hover:bg-white/10 transition-all hover:border-[#dfcfff] dark:hover:border-[#e2d5fa] dark:border-[#382b61]/30"
          >
            Learn More
          </a>
        </div>

        {/* Phones */}
        <div
          className="hero-in relative w-full items-center justify-center flex mt-5"
          style={{ animationDelay: '400ms' }}
        >
          <TwoPhoneMockup />
        </div>
      </div>
    </section>
  )
}
