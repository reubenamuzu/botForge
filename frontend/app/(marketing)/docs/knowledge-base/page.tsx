import { ALL_DOC_PAGES } from '@/lib/docs'
import { Callout } from '@/components/docs/Callout'

const meta = ALL_DOC_PAGES.find((p) => p.href === '/docs/knowledge-base')!

export default function KnowledgeBasePage() {
  return (
    <article data-docs-content className="docs-article">
      <div className="docs-meta">
        <span>{meta.readTime}</span>
        <span>{meta.lastUpdated}</span>
      </div>

      <h1>Knowledge Base</h1>
      <p className="docs-lead">
        Train your bot on your own content so it can answer customer questions accurately.
      </p>

      <h2 id="what-is-the-knowledge-base">What is the knowledge base?</h2>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
        The knowledge base is the collection of content your bot uses to answer questions. Every time a visitor sends a message, BotForge searches the knowledge base for the most relevant information and uses it to craft a response. The more accurate and thorough your knowledge base, the better your bot performs.
      </p>

      <h2 id="adding-faqs">Adding FAQs manually</h2>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
        FAQ pairs are the quickest way to add knowledge. Navigate to your bot&apos;s <strong>Knowledge</strong> tab and click <strong>Add FAQ</strong>.
      </p>
      <ul className="space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400 mb-4">
        <li><strong>Question</strong> — write it as a customer would ask it, e.g. &ldquo;What are your opening hours?&rdquo;</li>
        <li><strong>Answer</strong> — provide a complete, accurate answer. The bot uses this as context verbatim.</li>
      </ul>
      <Callout variant="tip" title="Start with your top 10">
        Think about the questions your customer support team answers every day and start there. FAQ pairs can be edited or deleted at any time.
      </Callout>

      <h2 id="crawling-a-url">Crawling a URL</h2>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
        If your business has a website with product pages, an FAQ page, or a blog, you can import that content automatically. Click <strong>Add URL</strong>, paste the full URL, and click <strong>Crawl</strong>. BotForge fetches the page, strips navigation and boilerplate, and indexes the main text content. Crawling typically takes 5–30 seconds.
      </p>
      <Callout variant="warning" title="Public pages only">
        Only publicly accessible pages can be crawled. Password-protected or JavaScript-rendered pages may not import correctly — use the PDF or FAQ method instead.
      </Callout>

      <h2 id="uploading-a-pdf">Uploading a PDF</h2>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
        PDFs are ideal for product catalogues, price lists, policy documents, and menus. Click <strong>Upload PDF</strong> and select a file. BotForge extracts all readable text and indexes it automatically.
      </p>
      <Callout variant="info">
        Supported: standard PDF files up to 10 MB with selectable text. Scanned (image-only) PDFs are not supported.
      </Callout>

      <h2 id="how-it-works">How it works</h2>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
        When content is added, BotForge converts each piece of text into an <strong>embedding</strong> — a numerical vector that captures the meaning of the text — and stores it in a vector database.
      </p>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
        When a visitor sends a message, BotForge embeds the query and performs a <strong>semantic search</strong> — finding entries similar in meaning, not just matching keywords. The most relevant entries are passed to the AI as context. This means a customer asking &ldquo;Do you close on Sundays?&rdquo; will match a FAQ that says &ldquo;Opening hours: Mon–Sat 8am–6pm.&rdquo;
      </p>

      <h2 id="tips-for-best-results">Tips for best results</h2>
      <ul className="space-y-3 text-gray-600 dark:text-gray-400">
        {[
          { title: 'Keep answers specific', body: 'Vague or overly long answers reduce accuracy. Aim for 1–4 concise sentences per FAQ.' },
          { title: 'Avoid duplicate content', body: 'If the same info appears in both a FAQ and a crawled URL, the bot may give inconsistent answers. Remove duplicates.' },
          { title: 'Update regularly', body: 'If your prices, hours, or policies change, update the knowledge base immediately to avoid outdated answers.' },
          { title: 'Review unanswered questions', body: 'Check the Conversations analytics tab regularly for questions the bot couldn\'t answer and add FAQs to cover them.' },
        ].map(({ title, body }) => (
          <li key={title} className="flex gap-3">
            <span className="text-[#6C47FF] font-bold shrink-0 mt-0.5">→</span>
            <span><strong className="text-[#1A1035] dark:text-white">{title}.</strong> {body}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}
