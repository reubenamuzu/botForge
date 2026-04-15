import { ALL_DOC_PAGES } from '@/lib/docs'
import { Callout } from '@/components/docs/Callout'

const meta = ALL_DOC_PAGES.find((p) => p.href === '/docs/billing')!

const plans = [
  { name: 'Free', price: 'GHS 0', period: 'forever', bots: '1 bot', messages: '50 msg / month', highlight: false },
  { name: 'Starter', price: 'GHS 120', period: '/ month', bots: '2 bots', messages: '1,000 msg / month', highlight: false },
  { name: 'Pro', price: 'GHS 300', period: '/ month', bots: '5 bots', messages: '5,000 msg / month', highlight: true },
  { name: 'Agency', price: 'GHS 700', period: '/ month', bots: 'Unlimited bots', messages: '20,000 msg / month', highlight: false },
]

export default function BillingPage() {
  return (
    <article data-docs-content>
      <div className="flex items-center justify-between mb-4 text-sm text-gray-400">
        <span>{meta.readTime}</span>
        <span>{meta.lastUpdated}</span>
      </div>

      <h1 className="text-3xl font-bold text-[#1A1035] dark:text-white mb-3">Billing &amp; Plans</h1>
      <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
        Simple pricing in Ghanaian Cedis (GHS), with payments processed securely via Paystack.
      </p>

      <h2 id="plans" className="text-xl font-semibold text-[#1A1035] dark:text-white mt-10 mb-5 scroll-mt-20">Plans &amp; Pricing</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-xl border p-5 ${
              plan.highlight
                ? 'border-[#6C47FF] bg-[#f0ebff] dark:bg-[#2d1f5e]'
                : 'border-gray-200 dark:border-[#2d1f5e] bg-white dark:bg-[#1A1035]/60'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-[#1A1035] dark:text-white">{plan.name}</span>
              {plan.highlight && (
                <span className="text-xs font-medium bg-[#6C47FF] text-white px-2 py-0.5 rounded-full">Popular</span>
              )}
            </div>
            <div className="mb-3">
              <span className="text-2xl font-bold text-[#1A1035] dark:text-white">{plan.price}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{plan.period}</span>
            </div>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>✓ {plan.bots}</li>
              <li>✓ {plan.messages}</li>
              <li>✓ Knowledge base</li>
              <li>✓ Conversations &amp; analytics</li>
            </ul>
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        All plans include: knowledge base, conversation history, analytics, lead capture, and the embeddable chat widget.
      </p>

      <h2 id="upgrading" className="text-xl font-semibold text-[#1A1035] dark:text-white mt-10 mb-3 scroll-mt-20">How to upgrade</h2>
      <ol className="space-y-2 list-decimal list-inside text-gray-600 dark:text-gray-400 mb-4">
        <li>From your Dashboard, click <strong>Billing</strong> in the left sidebar.</li>
        <li>Review the available plans and click <strong>Upgrade</strong> on the plan you want.</li>
        <li>You&apos;ll be redirected to Paystack&apos;s secure checkout to complete payment.</li>
        <li>Once payment is confirmed, your account is upgraded instantly.</li>
      </ol>
      <Callout variant="info">
        Upgrades take effect immediately. Downgrades take effect at the end of your current billing period.
      </Callout>

      <h2 id="payments" className="text-xl font-semibold text-[#1A1035] dark:text-white mt-10 mb-3 scroll-mt-20">Payments via Paystack</h2>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
        BotForge processes all payments through <strong>Paystack</strong>, a leading payment platform across Africa. Supported methods:
      </p>
      <ul className="space-y-1 list-disc list-inside text-gray-600 dark:text-gray-400 mb-4">
        <li>Mobile Money (MTN, Vodafone, AirtelTigo)</li>
        <li>GhIPSS (Ghana Interbank Payment and Settlement Systems)</li>
        <li>Visa and Mastercard debit/credit cards</li>
        <li>Bank transfers</li>
      </ul>
      <Callout variant="tip">
        BotForge does not store your card or mobile money details — all payment data is handled securely by Paystack.
      </Callout>

      <h2 id="message-limits" className="text-xl font-semibold text-[#1A1035] dark:text-white mt-10 mb-3 scroll-mt-20">What happens at your limit</h2>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
        When your account reaches its monthly message limit, your bot automatically responds with your configured <strong>fallback message</strong> instead of generating an AI response. Visitors can still open the widget — they simply receive the fallback until your allowance resets on the 1st of the next month.
      </p>
      <Callout variant="warning" title="Set a helpful fallback">
        Use a message like: &ldquo;Our chat is temporarily at capacity. Please call us on 0302 123456 or email hello@yourcompany.com.&rdquo; This ensures customers always have a way to reach you.
      </Callout>
    </article>
  )
}
