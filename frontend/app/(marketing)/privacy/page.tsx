import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-indigo-600">BotForge</Link>
          <Link href="/sign-in" className="text-sm font-medium text-gray-600 hover:text-gray-900">Sign in</Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="mb-10 text-sm text-gray-400">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-900">1. Information We Collect</h2>
            <p className="mt-3 leading-relaxed">We collect the following categories of information:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li><strong>Account information:</strong> Name and email address provided during registration via Clerk</li>
              <li><strong>Bot configuration:</strong> Bot names, greetings, knowledge base content you upload</li>
              <li><strong>Conversation data:</strong> Messages between your bots and your website visitors (including optional lead capture information)</li>
              <li><strong>Usage data:</strong> Message counts, feature usage, and access logs</li>
              <li><strong>Payment information:</strong> Payment is processed by Paystack; we store only your plan status, not card details</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">2. How We Use Your Information</h2>
            <p className="mt-3 leading-relaxed">We use collected information to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Provide, operate, and improve the Service</li>
              <li>Process payments and manage subscriptions</li>
              <li>Send transactional emails (account creation, usage alerts, payment receipts)</li>
              <li>Enforce our Terms of Service</li>
              <li>Respond to support enquiries</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">3. Conversation Data</h2>
            <p className="mt-3 leading-relaxed">Messages exchanged between your deployed bots and end-users are stored in our database to provide conversation history, analytics, and lead capture features. This data is accessible only to you through your BotForge account. We do not use visitor conversation data to train AI models or share it with third parties beyond what is necessary to process the AI response.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">4. AI Processing</h2>
            <p className="mt-3 leading-relaxed">User messages are processed by third-party AI providers (Anthropic for response generation, Google for embeddings) to generate bot responses. Please review their privacy policies: <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Anthropic</a>, <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Google</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">5. Data Sharing</h2>
            <p className="mt-3 leading-relaxed">We do not sell your personal data. We share data only with:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li><strong>Clerk</strong> — authentication and user management</li>
              <li><strong>Neon</strong> — database hosting (data stored in EU/US region)</li>
              <li><strong>Paystack</strong> — payment processing</li>
              <li><strong>Resend</strong> — transactional email delivery</li>
              <li><strong>Anthropic / Google</strong> — AI response generation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">6. Data Retention</h2>
            <p className="mt-3 leading-relaxed">We retain your data for as long as your account is active. When you delete your account, your data is scheduled for permanent deletion after a 30-day grace period. You may request early deletion by contacting us.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">7. Your Rights</h2>
            <p className="mt-3 leading-relaxed">You have the right to:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your conversation data (via the Conversations page)</li>
            </ul>
            <p className="mt-3 leading-relaxed">To exercise these rights, contact us at <a href="mailto:privacy@botforge.app" className="text-indigo-600 hover:underline">privacy@botforge.app</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">8. Cookies</h2>
            <p className="mt-3 leading-relaxed">We use session cookies and localStorage for authentication (via Clerk) and to store widget session identifiers. We do not use tracking or advertising cookies.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">9. Security</h2>
            <p className="mt-3 leading-relaxed">We use industry-standard security measures including HTTPS encryption, secure database connections, and access controls. However, no system is 100% secure and we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">10. Contact</h2>
            <p className="mt-3 leading-relaxed">For privacy-related questions or requests, contact us at <a href="mailto:privacy@botforge.app" className="text-indigo-600 hover:underline">privacy@botforge.app</a>.</p>
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
