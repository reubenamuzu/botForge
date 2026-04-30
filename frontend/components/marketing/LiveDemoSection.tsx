'use client'

import { useState, useRef, useEffect } from 'react'
import { Logo } from '@/components/Logo'

const DEMO_BOT_ID = process.env.NEXT_PUBLIC_DEMO_BOT_ID

const SUGGESTIONS = [
  'Do you ship to Dubai?',
  'What payment methods?',
  'Tell me about returns',
]

type Message = { from: 'bot' | 'user'; text: string }

export default function LiveDemoSection() {
  const [messages, setMessages] = useState<Message[]>([
    { from: 'bot', text: "Hi! I'm StyleKart's bot, trained on this store's FAQs. Ask me anything." },
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [convId, setConvId] = useState<string | undefined>(undefined)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, thinking])

  const send = async () => {
    if (!input.trim() || thinking || !DEMO_BOT_ID) return
    const userMsg = input.trim()
    setMessages((m) => [...m, { from: 'user', text: userMsg }])
    setInput('')
    setThinking(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botId: DEMO_BOT_ID, message: userMsg, conversationId: convId }),
      })
      const data = await res.json()
      if (data.conversationId) setConvId(data.conversationId)
      setMessages((m) => [...m, { from: 'bot', text: data.message ?? 'Sorry, something went wrong.' }])
    } catch {
      setMessages((m) => [...m, { from: 'bot', text: "Hmm, I'm having trouble responding. Try again?" }])
    } finally {
      setThinking(false)
    }
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <section className="relative overflow-hidden bg-[#F0EDFA] dark:bg-[#0A0518] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-50" style={{
        backgroundImage: 'linear-gradient(rgba(108,71,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(108,71,255,0.05) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
      }} />

      <div className="relative z-10 mx-auto max-w-[1100px]">
        <div className="mb-12 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E8E3F5] dark:border-white/10 bg-white dark:bg-white/5 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-[#4F35CC] dark:text-[#c9b1ff]">
            LIVE DEMO ·
          </div>
          <h2 className="mx-auto m-0 max-w-[720px] text-[34px] font-bold leading-[1.05] tracking-[-0.035em] text-[#1A1035] dark:text-[#F4F1FF] sm:text-[52px]">
            Don&rsquo;t take our word for it.
            <br />
            <span style={{ fontFamily: 'var(--font-instrument-serif), "Instrument Serif", Georgia, serif' }}
              className="font-normal italic text-[#6C47FF] dark:text-[#8B6FFF]">
              Try it yourself.
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-[480px] text-[15px] leading-[1.6] text-[#6B6490] dark:text-[#8B82B0]">
            This is a real BotForge bot, trained on a fictional store&rsquo;s FAQs in minutes. Ask it anything.
          </p>
        </div>

        {!DEMO_BOT_ID ? (
          <div className="mx-auto max-w-[560px] rounded-2xl border border-[#E8E3F5] dark:border-white/10 bg-white dark:bg-[#15102E] p-10 text-center">
            <Logo size={32} />
            <p className="mt-4 font-mono text-[14px] text-[#6B6490] dark:text-[#8B82B0]">
              Demo bot coming soon.
            </p>
          </div>
        ) : (
          <div className="mx-auto max-w-[680px] overflow-hidden rounded-2xl border border-white/20 bg-[#0E0820] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
            {/* Terminal header */}
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
              <span className="ml-3 font-mono text-[12px] text-white/40">
                stylekart-bot.live · 1.2s p50 · ● connected
              </span>
              <span className="ml-auto rounded-full bg-[#7CFFB2]/10 px-2 py-0.5 font-mono text-[11px] text-[#7CFFB2]">
                live
              </span>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex h-[300px] flex-col gap-3 overflow-y-auto p-4 sm:h-[340px] sm:p-5">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-2.5 ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.from === 'bot' && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#6C47FF]/15">
                      <Logo size={14} color="#c9b1ff" />
                    </div>
                  )}
                  <div className={`max-w-[86%] rounded-xl px-3 py-2 text-[13px] leading-[1.55] border sm:max-w-[72%] sm:px-3.5 sm:py-2.5 sm:text-[14px] ${
                    m.from === 'user'
                      ? 'rounded-tr-sm border-white/10 bg-[#6C47FF]/18 text-[#E8E0FF]'
                      : 'rounded-tl-sm border-white/10 bg-white/[0.04] text-[#F0E9FF]'
                  }`}>{m.text}</div>
                </div>
              ))}
              {thinking && (
                <div className="flex gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#6C47FF]/15">
                    <Logo size={14} color="#c9b1ff" />
                  </div>
                  <div className="flex items-center gap-1 rounded-xl rounded-tl-sm border border-white/10 bg-white/[0.04] px-3.5 py-3">
                    {[0, 1, 2].map((i) => (
                      <span key={i} className="h-1.5 w-1.5 rounded-full bg-[#c9b1ff]"
                        style={{ animation: `demoBounce 1s ${i * 0.15}s infinite` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            {messages.length === 1 && !thinking && (
              <div className="flex flex-wrap gap-2 px-5 pb-3">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => setInput(s)}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-[12px] text-[#dcd1ff] transition-colors hover:bg-white/10">
                    ↳ {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="flex items-center gap-2 border-t border-white/10 px-4 py-3">
              <span className="font-mono text-[14px] leading-none text-[#7CFFB2]">$</span>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                placeholder="ask the bot anything…"
                className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-[14px] text-[#F0E9FF] outline-none placeholder:text-white/25 focus:border-white/20"
              />
              <button onClick={send} disabled={!input.trim() || thinking}
                className="rounded-lg px-3 py-2 font-mono text-[13px] font-bold transition-colors disabled:cursor-not-allowed disabled:bg-white/5 disabled:text-white/30 enabled:bg-[#c9b1ff] enabled:text-[#0e0820] enabled:hover:bg-[#dcd1ff]">
                send ↵
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes demoBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-3px); opacity: 1; }
        }
      `}</style>
    </section>
  )
}
