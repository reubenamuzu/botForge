'use client'

import Link from 'next/link'

function ChatPhone() {
  const messages = [
    { from: 'bot', text: 'Hi! Welcome to StyleKart. How can I help today?' },
    { from: 'user', text: 'Do you ship to Kumasi?' },
    { from: 'bot', text: 'Yes — standard delivery is 2–3 days, express is next-day.' },
    { from: 'user', text: "What's the return window?" },
    { from: 'bot', text: '30 days, full refund. We even cover return shipping.' },
  ]

  return (
    <div className="relative h-[540px] w-[270px] overflow-hidden rounded-[40px] border-[7px] border-[#1C1C1E] bg-[#1C1C1E] shadow-[0_30px_80px_-20px_rgba(26,16,53,0.45)]">
      <div className="absolute left-1/2 top-2 z-50 h-[24px] w-[80px] -translate-x-1/2 rounded-full bg-black" />
      <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[34px] bg-[#F5F3FF]">
        <div className="flex items-center gap-2.5 bg-[#6C47FF] pb-3 pl-4 pr-4 pt-10">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-[11px] font-bold text-white">SK</div>
          <div>
            <div className="text-[12px] font-semibold text-white">StyleKart</div>
            <div className="flex items-center gap-1 text-[10px] text-[#dcd1ff]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7CFFB2]" />
              Powered by BotForge
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2.5 overflow-hidden p-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2 ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
              style={{ animation: `heroMsgIn 0.4s ${i * 0.12}s both` }}>
              {m.from === 'bot' && (
                <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#6C47FF] text-[9px] font-bold text-white">SK</div>
              )}
              <div className={`max-w-[78%] rounded-2xl px-3 py-1.5 text-[11px] leading-relaxed ${
                m.from === 'user' ? 'rounded-tr-sm bg-[#6C47FF] text-white' : 'rounded-tl-sm bg-white text-[#1A1035] shadow-sm'
              }`}>{m.text}</div>
            </div>
          ))}
        </div>
        <div className="border-t border-[#ede9f8] bg-white p-2.5">
          <div className="flex items-center gap-1.5 rounded-xl border border-[#ede9f8] bg-[#F5F3FF] px-2 py-1.5">
            <span className="flex-1 text-[10px] text-[#6B6490]">Type a message…</span>
            <div className="flex h-[18px] w-[18px] items-center justify-center rounded-md bg-[#6C47FF] text-[10px] font-bold text-white">↑</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#F8F8FF] dark:bg-[#0E0820] px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-12 lg:px-12 lg:pb-24 lg:pt-16 xl:px-20">
      <div className="pointer-events-none absolute inset-0 opacity-50" style={{
        backgroundImage: 'linear-gradient(rgba(108,71,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(108,71,255,0.06) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
      }} />
      <div className="pointer-events-none absolute -top-48 right-[-10%] h-[600px] w-[600px] rounded-full bg-[#6C47FF] opacity-[0.18] blur-[160px] dark:opacity-[0.22]" />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 pt-4 sm:gap-12 sm:pt-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pt-8">
        {/* Left */}
        <div>
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#E8E3F5] dark:border-white/10 bg-white dark:bg-white/5 px-3 py-1.5">
            <span className="rounded-full bg-[#F5F3FF] dark:bg-white/10 px-2 py-0.5 font-mono text-[10px] font-bold tracking-[0.06em] text-[#4F35CC] dark:text-[#c9b1ff]">v1.0</span>
            <span className="font-mono text-[11px] text-[#6B6490] dark:text-white/50">multi-bot teams · now in beta</span>
          </div>

          <h1 className="m-0 text-[38px] font-bold leading-[1.05] tracking-[-0.04em] text-[#1A1035] dark:text-[#F4F1FF] sm:text-[56px] lg:text-[74px]">
            AI Support That Works<br />
            <span style={{ fontFamily: 'var(--font-instrument-serif), "Instrument Serif", Georgia, serif' }}
              className="font-normal italic text-[#6C47FF] dark:text-[#8B6FFF]">
              While You Scale.
            </span>
          </h1>

          <p className="mt-6 max-w-[560px] text-[15px] leading-[1.55] text-[#6B6490] dark:text-[#8B82B0] sm:text-[17px]">
            Train a bot on your FAQs, help docs, and PDFs — then add it to your website with one line of code.
            Your customers get instant answers 24/7, even when you&rsquo;re offline.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/sign-up" className="inline-flex items-center gap-2 rounded-lg bg-[#6C47FF] px-5 py-3 text-[14px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(108,71,255,0.5)] transition-opacity hover:opacity-90">
              Get started free →
            </Link>
            <a href="#how-it-works" className="inline-flex items-center gap-2 rounded-lg border border-[#E8E3F5] dark:border-white/10 bg-white dark:bg-white/5 px-5 py-3 text-[14px] font-medium text-[#1A1035] dark:text-[#F4F1FF] transition-colors hover:bg-[#F0EDFA] dark:hover:bg-white/10">
              See how it works
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4 text-[13px] text-[#6B6490] dark:text-[#8B82B0]">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#22A06B] dark:bg-[#7CFFB2]" />
              Always online
            </span>
            <span className="text-[#D8D1ED] dark:text-white/20">·</span>
            <span>5+ businesses using BotForge</span>
            <span className="text-[#D8D1ED] dark:text-white/20">·</span>
            <span>Answers in under 2 seconds</span>
          </div>
        </div>

        {/* Right — phone + terminal card */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative origin-top scale-[0.82] sm:scale-100">
            <div className="absolute -bottom-4 -left-2 z-0 w-[250px] -rotate-[4deg] overflow-hidden rounded-xl border border-white/20 bg-[#0E0820] shadow-[0_30px_60px_-25px_rgba(0,0,0,0.5)] sm:-bottom-6 sm:-left-10 sm:w-[300px]">
              <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2.5">
                <span className="h-2 w-2 rounded-full bg-[#FF5F57]" />
                <span className="h-2 w-2 rounded-full bg-[#FEBC2E]" />
                <span className="h-2 w-2 rounded-full bg-[#28C840]" />
                <span className="ml-2 font-mono text-[11px] text-white/40">embed.html</span>
              </div>
              <pre className="m-0 px-4 py-3 font-mono text-[11px] leading-[1.7]">
                <span className="text-[#7CB7FF]">{'<script'}</span>{'\n  '}
                <span className="text-[#c9b1ff]">src=</span><span className="text-[#7CFFB2]">"…/widget.js"</span>{'\n  '}
                <span className="text-[#c9b1ff]">data-bot-id=</span><span className="text-[#7CFFB2]">"bot_3xKp9"</span>{'\n'}
                <span className="text-[#7CB7FF]">{'></script>'}</span>
              </pre>
            </div>
            <div className="relative z-10"><ChatPhone /></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes heroMsgIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}
