import { ALL_DOC_PAGES } from '@/lib/docs'
import { Callout } from '@/components/docs/Callout'
import { CodeBlock } from '@/components/docs/CodeBlock'

const meta = ALL_DOC_PAGES.find((p) => p.href === '/docs/getting-started')!

export default function GettingStartedPage() {
  return (
    <article data-docs-content className="docs-article">
      <div className="docs-meta">
        <span>{meta.readTime}</span>
        <span>{meta.lastUpdated}</span>
      </div>

      <h1>Getting Started</h1>
      <p className="docs-lead">
        Set up your first AI bot and have it live on your website in under 10 minutes.
      </p>

      <h2 id="what-is-botforge">What is BotForge?</h2>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
        BotForge is a no-code platform that lets businesses build AI-powered customer support chatbots — trained on their own content — and embed them on any website in minutes. No developers required.
      </p>

      <h2 id="create-your-account">Step 1: Create your account</h2>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
        Go to <a href="/sign-up" className="text-[#6C47FF] hover:underline">botforge.io/sign-up</a> and create a free account using your email address or Google account. No credit card is required.
      </p>
      <Callout variant="tip" title="Free plan">
        The free plan lets you create 1 bot and handle up to 50 messages per month — perfect for getting started with no commitment.
      </Callout>

      <h2 id="create-your-first-bot">Step 2: Create your first bot</h2>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
        From your dashboard, click <strong>New Bot</strong>. You&apos;ll fill in three fields:
      </p>
      <ul className="space-y-4 mb-4">
        {[
          { n: '1', label: 'Bot name', desc: 'A friendly name shown in the chat widget, e.g. "Ama from Koala Stores".' },
          { n: '2', label: 'System prompt', desc: 'Instructions that shape how the bot responds, e.g. "You are a helpful support agent for Koala Stores. Be friendly and concise."' },
          { n: '3', label: 'Fallback message', desc: "Shown when the bot can't answer, e.g. \"I'm not sure — please call us on 0302 123456.\"" },
        ].map(({ n, label, desc }) => (
          <li key={n} className="flex gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#6C47FF] text-white text-xs font-bold">{n}</span>
            <div>
              <strong className="text-[#1A1035] dark:text-white">{label}</strong>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{desc}</p>
            </div>
          </li>
        ))}
      </ul>

      <h2 id="add-knowledge">Step 3: Add knowledge</h2>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
        Navigate to your bot&apos;s <strong>Knowledge</strong> tab to add content in three ways:
      </p>
      <ul className="space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400 mb-4">
        <li><strong>FAQs</strong> — manually write question and answer pairs</li>
        <li><strong>URL crawl</strong> — paste a webpage URL and we scrape the text automatically</li>
        <li><strong>PDF upload</strong> — upload a product guide, menu, or policy document</li>
      </ul>
      <Callout variant="info">
        See the <a href="/docs/knowledge-base" className="text-[#6C47FF] hover:underline">Knowledge Base</a> guide for a full walkthrough of each method.
      </Callout>

      <h2 id="test-your-bot">Step 4: Test your bot</h2>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
        Open the <strong>Test</strong> tab on your bot page. A live chat preview lets you ask questions exactly as your visitors would. Verify that answers are accurate and the fallback triggers correctly when the bot doesn&apos;t know something.
      </p>

      <h2 id="embed-on-your-website">Step 5: Embed on your website</h2>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
        Go to the <strong>Embed</strong> tab and copy the snippet. Paste it before the closing{' '}
        <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">&lt;/body&gt;</code>{' '}
        tag on every page where you want the widget to appear.
      </p>
      <CodeBlock language="html" code={`<script
  src="https://botforge.io/widget.js"
  data-bot-id="YOUR_BOT_ID"
  async
></script>`} />
      <Callout variant="tip">
        The widget loads asynchronously and won&apos;t affect your page speed. See the{' '}
        <a href="/docs/embedding" className="text-[#6C47FF] hover:underline">Embedding guide</a> for WordPress, Webflow, and other platforms.
      </Callout>
    </article>
  )
}
