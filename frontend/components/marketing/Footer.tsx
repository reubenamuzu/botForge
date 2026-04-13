import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="relative bg-transparent pt-12 pb-8 px-6 sm:px-12">
      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5 border-b border-[#e2d5fa] pb-12">
          <div className="lg:col-span-2 pr-8">
            <Link href="/" className="text-xl font-extrabold text-[#6C47FF] tracking-tight flex items-center gap-2">
              BotForge
            </Link>
            <p className="mt-5 text-[15px] font-medium leading-relaxed text-[#6B6490] dark:text-white/60">
              Premium AI support agents for modern businesses. Empowering your customer experience 24/7 with zero coding involved.
            </p>
          </div>

          <div>
            <p className="mb-5 text-sm font-bold text-[#1A1035] dark:text-white uppercase tracking-wider">Product</p>
            <ul className="space-y-3.5">
              <li><a href="#features" className="text-[15px] font-medium text-[#6B6490] dark:text-white/60 hover:text-[#8a68ff] transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-[15px] font-medium text-[#6B6490] dark:text-white/60 hover:text-[#8a68ff] transition-colors">Pricing</a></li>
              <li><a href="#how-it-works" className="text-[15px] font-medium text-[#6B6490] dark:text-white/60 hover:text-[#8a68ff] transition-colors">How it works</a></li>
            </ul>
          </div>

          <div>
            <p className="mb-5 text-sm font-bold text-[#1A1035] dark:text-white uppercase tracking-wider">Account</p>
            <ul className="space-y-3.5">
              <li><Link href="/sign-in" className="text-[15px] font-medium text-[#6B6490] dark:text-white/60 hover:text-[#8a68ff] transition-colors">Sign in</Link></li>
              <li><Link href="/sign-up" className="text-[15px] font-medium text-[#6B6490] dark:text-white/60 hover:text-[#8a68ff] transition-colors">Create account</Link></li>
              <li><Link href="/dashboard" className="text-[15px] font-medium text-[#6B6490] dark:text-white/60 hover:text-[#8a68ff] transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-5 text-sm font-bold text-[#1A1035] dark:text-white uppercase tracking-wider">Legal</p>
            <ul className="space-y-3.5">
              <li><Link href="/privacy" className="text-[15px] font-medium text-[#6B6490] dark:text-white/60 hover:text-[#8a68ff] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-[15px] font-medium text-[#6B6490] dark:text-white/60 hover:text-[#8a68ff] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-[13px] font-medium text-[#6B6490] dark:text-white/60">
            © {new Date().getFullYear()} BotForge AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
