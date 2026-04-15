export interface DocPage {
  label: string
  href: string
  description: string
  keywords: string[]
  readTime: string
  lastUpdated: string
}

export interface DocSection {
  title: string
  items: DocPage[]
}

export const DOC_SECTIONS: DocSection[] = [
  {
    title: 'Overview',
    items: [
      {
        label: 'Getting Started',
        href: '/docs/getting-started',
        description: 'Set up your first BotForge bot in minutes',
        keywords: ['setup', 'install', 'create', 'begin', 'first', 'bot', 'account', 'embed'],
        readTime: '5 min read',
        lastUpdated: 'April 15, 2025',
      },
    ],
  },
  {
    title: 'Features',
    items: [
      {
        label: 'Knowledge Base',
        href: '/docs/knowledge-base',
        description: 'Add FAQs, crawl URLs, and upload PDFs to train your bot',
        keywords: ['faq', 'url', 'pdf', 'crawl', 'upload', 'train', 'semantic', 'search', 'embeddings'],
        readTime: '4 min read',
        lastUpdated: 'April 15, 2025',
      },
      {
        label: 'Embedding',
        href: '/docs/embedding',
        description: 'Add the chat widget to any website — HTML, WordPress, Webflow',
        keywords: ['embed', 'widget', 'html', 'wordpress', 'webflow', 'script', 'install', 'website'],
        readTime: '3 min read',
        lastUpdated: 'April 15, 2025',
      },
      {
        label: 'Conversations',
        href: '/docs/conversations',
        description: 'View chat history, leads, and analytics for your bots',
        keywords: ['chat', 'history', 'leads', 'analytics', 'messages', 'sessions', 'visitors'],
        readTime: '3 min read',
        lastUpdated: 'April 15, 2025',
      },
    ],
  },
  {
    title: 'Account',
    items: [
      {
        label: 'Billing & Plans',
        href: '/docs/billing',
        description: 'Plans, pricing in GHS, and how payments work via Paystack',
        keywords: ['billing', 'plans', 'pricing', 'upgrade', 'paystack', 'free', 'starter', 'pro', 'agency', 'ghs'],
        readTime: '2 min read',
        lastUpdated: 'April 15, 2025',
      },
    ],
  },
]

export const ALL_DOC_PAGES: DocPage[] = DOC_SECTIONS.flatMap((section) => section.items)
