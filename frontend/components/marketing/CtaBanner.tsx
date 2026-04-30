import Link from 'next/link'
import { Logo } from '@/components/Logo'

export default function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-[#F0EDFA] dark:bg-[#0A0518] px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="pointer-events-none absolute inset-0 opacity-60" style={{
        backgroundImage: 'linear-gradient(rgba(108,71,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(108,71,255,0.06) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6C47FF] opacity-20 blur-[160px]" />

      <div className="relative z-10 mx-auto max-w-[680px]">
        <Logo size={48} />
        <h2 className="mb-0 mt-6 text-[34px] font-bold leading-[1.05] tracking-[-0.035em] text-[#1A1035] dark:text-[#F4F1FF] sm:text-[56px]">
          Your customers deserve
          <br />
          <span style={{ fontFamily: 'var(--font-instrument-serif), "Instrument Serif", Georgia, serif' }}
            className="font-normal italic text-[#6C47FF] dark:text-[#8B6FFF]">
            instant answers.
          </span>
        </h2>
        <p className="mt-5 text-[16px] text-[#6B6490] dark:text-[#8B82B0]">
          Free to start. Live in under 30 minutes. No credit card required.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/sign-up" className="inline-flex items-center gap-2 rounded-lg bg-[#6C47FF] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(108,71,255,0.5)] transition-opacity hover:opacity-90">
            Get started free →
          </Link>
          <Link href="/sign-up" className="inline-flex items-center gap-2 rounded-lg border border-[#E8E3F5] dark:border-white/10 bg-white dark:bg-white/5 px-6 py-3 text-[14px] font-medium text-[#1A1035] dark:text-[#F4F1FF] transition-colors hover:bg-[#F8F8FF] dark:hover:bg-white/10">
            Talk to us
          </Link>
        </div>
      </div>
    </section>
  )
}
