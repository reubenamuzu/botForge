# BotForge

**AI-powered support bots for every business.**  
Build, train, and embed a custom chatbot on your website in 30 minutes — no coding required.

---

## Overview

BotForge is a full-stack SaaS platform that lets businesses create AI support bots trained on their own content (FAQs, URLs, PDFs). Bots are embedded on any website with a single `<script>` tag and powered by Claude (Anthropic) for chat responses and Gemini for embeddings — delivering accurate, context-aware answers.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16 (App Router), Tailwind CSS, shadcn/ui, Recharts |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | PostgreSQL (Neon serverless) + pgvector |
| **ORM** | Prisma |
| **Auth** | Clerk |
| **AI — Chat** | Anthropic Claude Haiku (`claude-haiku-4-5`) |
| **AI — Embeddings** | Google Gemini (`gemini-embedding-001`, 3072-dim) |
| **Payments** | Paystack (GHS) |
| **Email** | Resend |
| **Widget** | Vanilla JS, zero dependencies |

---

## Features

- **Bot builder** — Configure name, greeting, tone, fallback message, active status
- **Knowledge base** — Add FAQs, scrape URLs, upload PDFs; all vectorised automatically
- **RAG chat engine** — Vector similarity search + Claude generates grounded responses
- **Embeddable widget** — One `<script>` tag, dynamic colour/position theming, lead capture form
- **Analytics dashboard** — Conversation metrics, 7-day message chart, top questions, unanswered count
- **Conversation logs** — Full message threads with side-panel viewer
- **Lead capture** — Optional name/email form before chat starts; Leads tab with CSV export
- **Billing** — 4-tier plans (Free → Agency) via Paystack with usage enforcement
- **Onboarding wizard** — 3-step guided setup shown once to new users
- **Settings** — Profile view, 30-day grace-period account deletion
- **Transactional emails** — Welcome, 80% usage alert, payment receipt (Resend)
- **Landing page** — Hero, how-it-works, pricing, footer
- **Terms & Privacy** — Static legal pages

---

## Project Structure

```
botforge/
├── backend/                    # Express API
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   ├── public/
│   │   ├── widget.js           # Embeddable chat widget (vanilla JS)
│   │   └── demo.html           # Widget live-preview page
│   └── src/
│       ├── index.ts            # Server entry point
│       ├── lib/
│       │   ├── chat.ts         # Claude response generation
│       │   ├── db.ts           # Prisma + Neon client
│       │   ├── email.ts        # Resend transactional emails
│       │   ├── embeddings.ts   # Gemini embeddings
│       │   ├── limits.ts       # Plan-based rate limiting
│       │   └── retrieval.ts    # Vector similarity search
│       ├── middlewares/
│       │   ├── auth.ts         # Clerk authentication middleware
│       │   └── error.ts        # Global error handler
│       └── routes/
│           ├── analytics.ts    # Analytics + conversation endpoints
│           ├── billing.ts      # Paystack billing
│           ├── bots.ts         # Bot CRUD + knowledge + leads
│           ├── chat.ts         # Chat endpoint (public)
│           ├── index.ts        # Router registration
│           ├── public.ts       # Public bot config for widget
│           ├── users.ts        # User profile + onboarding
│           └── webhooks.ts     # Clerk + Paystack webhooks
│
├── frontend/                   # Next.js app
│   └── app/
│       ├── (dashboard)/        # Authenticated dashboard layout
│       │   └── dashboard/
│       │       ├── bots/
│       │       │   ├── page.tsx                # Bot list + create
│       │       │   └── [botId]/
│       │       │       ├── page.tsx            # Configure / Knowledge / Appearance tabs
│       │       │       ├── analytics/          # Analytics dashboard
│       │       │       ├── conversations/      # Conversation logs + Leads tab
│       │       │       ├── embed/              # Embed code + live preview
│       │       │       └── test/               # Live bot test UI
│       │       ├── billing/                    # Plan cards + usage bars
│       │       └── settings/                   # Profile + account deletion
│       └── (marketing)/        # Public pages (no auth required)
│           ├── page.tsx        # Landing page
│           ├── terms/          # Terms of Service
│           └── privacy/        # Privacy Policy
│
└── sprint.md                   # Full sprint roadmap and tracker
```

---

## Plans

| Plan | Bots | Messages/mo | PDF & URL | White-label | Price |
|---|---|---|---|---|---|
| **Free** | 1 | 50 | ✗ | ✗ | GHS 0 |
| **Starter** | 2 | 1,000 | ✓ | ✗ | GHS 120/mo |
| **Pro** | 5 | 5,000 | ✓ | ✗ | GHS 300/mo |
| **Agency** | ∞ | 20,000 | ✓ | ✓ | GHS 700/mo |

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL with pgvector extension ([Neon](https://neon.tech) recommended — free tier available)
- [Clerk](https://clerk.com) account
- [Anthropic](https://console.anthropic.com) API key
- [Google AI Studio](https://aistudio.google.com) API key (Gemini)
- [Paystack](https://paystack.com) account
- [Resend](https://resend.com) account

---

### Backend setup

```bash
cd backend
npm install
cp .env.example .env   # fill in all values
npm run db:push        # push schema to your database
npm run dev            # starts on http://localhost:4000
```

**`backend/.env`**
```env
DATABASE_URL=postgresql://user:password@host/database
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=AIza...
PAYSTACK_SECRET_KEY=sk_live_...
PAYSTACK_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=BotForge <noreply@yourdomain.com>
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:4000
PORT=4000
```

---

### Frontend setup

```bash
cd frontend
npm install
cp .env.example .env.local   # fill in all values
npm run dev                  # starts on http://localhost:3000
```

**`frontend/.env.local`**
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

### Clerk webhooks

In your Clerk dashboard, add a webhook pointing to:

```
https://your-backend.com/api/webhooks/clerk
```

Subscribe to: `user.created`, `user.updated`, `user.deleted`

---

### Paystack webhooks

In your Paystack dashboard, add a webhook pointing to:

```
https://your-backend.com/api/billing/webhook
```

---

## Widget Embed

Copy this snippet from the **Embed** tab in your bot dashboard, or construct it manually:

```html
<!-- Paste before </body> on your website -->
<script src="https://your-backend.com/widget.js" data-bot-id="YOUR_BOT_ID"></script>
```

The widget automatically applies your bot's colour scheme, bubble position, and lead capture settings — no extra configuration needed in the HTML.

---

## API Reference

All dashboard endpoints require `Authorization: Bearer <clerk-jwt-token>`.

### Bots
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/bots` | Create a new bot |
| `GET` | `/api/bots` | List all bots for current user |
| `GET` | `/api/bots/:botId` | Get a single bot |
| `PATCH` | `/api/bots/:botId` | Update bot config |
| `DELETE` | `/api/bots/:botId` | Delete bot |
| `POST` | `/api/bots/:botId/knowledge` | Add knowledge item (FAQ / URL / PDF) |
| `GET` | `/api/bots/:botId/knowledge` | List knowledge items |
| `DELETE` | `/api/bots/:botId/knowledge/:itemId` | Delete knowledge item |
| `GET` | `/api/bots/:botId/leads` | Paginated list of captured leads |

### Chat (public — no auth)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/chat` | Send a message, receive AI reply |
| `GET` | `/api/bots/:botId/public` | Bot config for the widget |

### Analytics
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/analytics/:botId/summary` | Metrics, top questions, 7-day chart |
| `GET` | `/api/analytics/:botId/conversations` | Paginated conversation list |
| `GET` | `/api/analytics/:botId/conversations/:id` | Full message thread |

### Billing
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/billing/usage` | Current plan + usage counts |
| `POST` | `/api/billing/initialize` | Start Paystack checkout |
| `GET` | `/api/billing/callback` | Paystack redirect handler |

### Users
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users/me` | Current user + onboarding status |
| `PATCH` | `/api/users/me/onboarding` | Mark onboarding complete |
| `DELETE` | `/api/users/me` | Soft-delete account (30-day grace period) |

---

## Sprint Progress

See [`sprint.md`](./sprint.md) for the full detailed roadmap.

| Sprint | Theme | Status |
|---|---|---|
| 1 | Foundation (Auth + DB) | ✅ Done |
| 2 | Bot CRUD + Knowledge Base | ✅ Done |
| 3 | RAG Chat Engine | ✅ Done |
| 4 | Billing + Plan Gating | ✅ Done |
| 5 | Embeddable Widget | ✅ Done |
| 6 | Analytics + Logs + Landing | ✅ Done |
| 7 | Launch Readiness | ✅ Done |
| 8 | Team Accounts | ⬜ Next |
| 9 | WhatsApp Integration | ⬜ Planned |
| 10 | Growth Loops | ⬜ Planned |
| 11 | UI Polish | ⬜ Planned |
| 12 | Dashboard UX Upgrades | ⬜ Planned |
| 13 | SEO + Performance | ⬜ Planned |
| 14 | Developer Platform | ⬜ Planned |

---

## License

Private — all rights reserved.
