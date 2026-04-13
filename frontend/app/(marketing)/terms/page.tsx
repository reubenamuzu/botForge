import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#1A1035]">
      <header className="border-b border-gray-100">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-indigo-600">BotForge</Link>
          <Link href="/sign-in" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-100">Sign in</Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">Terms of Service</h1>
        <p className="mb-10 text-sm text-gray-400">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 dark:text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">1. Acceptance of Terms</h2>
            <p className="mt-3 leading-relaxed">By accessing or using BotForge (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">2. Description of Service</h2>
            <p className="mt-3 leading-relaxed">BotForge provides an AI-powered chatbot platform that allows businesses to create, configure, and embed automated support bots on their websites. The Service is powered by third-party AI providers including Anthropic and Google.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">3. Account Registration</h2>
            <p className="mt-3 leading-relaxed">You must create an account to use the Service. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You must provide accurate and complete information when creating your account.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">4. Subscription and Payments</h2>
            <p className="mt-3 leading-relaxed">BotForge offers both free and paid subscription plans. Paid subscriptions are billed monthly in Ghana Cedis (GHS) via Paystack. Payments are non-refundable except as required by law. We reserve the right to change pricing with 30 days notice.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">5. Acceptable Use</h2>
            <p className="mt-3 leading-relaxed">You agree not to use the Service to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Violate any applicable laws or regulations</li>
              <li>Transmit spam, malware, or harmful content</li>
              <li>Harass, abuse, or harm others</li>
              <li>Infringe on intellectual property rights</li>
              <li>Attempt to gain unauthorized access to the Service or its systems</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">6. Data and Privacy</h2>
            <p className="mt-3 leading-relaxed">Your use of the Service is also governed by our <Link href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link>. By using the Service, you consent to the collection and use of your information as described therein. Conversation data collected by your bots is stored securely and accessible only to your account.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">7. Intellectual Property</h2>
            <p className="mt-3 leading-relaxed">You retain ownership of all content you provide to the Service, including knowledge base items. You grant BotForge a limited licence to process this content solely to provide the Service. BotForge retains ownership of the platform, software, and all related intellectual property.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">8. Limitation of Liability</h2>
            <p className="mt-3 leading-relaxed">The Service is provided &quot;as is&quot; without warranties of any kind. BotForge shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">9. Termination</h2>
            <p className="mt-3 leading-relaxed">We may suspend or terminate your account if you violate these Terms. You may delete your account at any time from your account settings. Upon termination, your data will be retained for 30 days before permanent deletion.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">10. Changes to Terms</h2>
            <p className="mt-3 leading-relaxed">We may update these Terms at any time. Continued use of the Service after changes constitutes acceptance of the updated Terms. We will notify you of material changes via email.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">11. Contact</h2>
            <p className="mt-3 leading-relaxed">For questions about these Terms, contact us at <a href="mailto:legal@botforge.app" className="text-indigo-600 hover:underline">legal@botforge.app</a>.</p>
          </section>
        </div>
      </main>

      <footer className="border-t border-gray-100 py-8">
        <div className="mx-auto max-w-4xl px-6 flex justify-between text-sm text-gray-400">
          <span>© {new Date().getFullYear()} BotForge</span>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-gray-600">Terms</Link>
            <Link href="/privacy" className="hover:text-gray-600">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
