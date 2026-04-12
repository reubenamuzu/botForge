import {
  Zap,
  Globe,
  Bot,
  ShieldCheck,
  BarChart3,
  Users,
  MessageSquare,
  Settings,
  Code2,
  type LucideIcon,
} from 'lucide-react'

/* ─── SVG pattern helpers ──────────────────────────────────── */

export const DOT_GRID = `url("data:image/svg+xml,%3Csvg width='28' height='28' viewBox='0 0 28 28' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23D9D3F0' fill-opacity='0.7'/%3E%3C/svg%3E")`
export const MESH_GRID = `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='0.5' fill='%236C47FF' fill-opacity='0.3'/%3E%3C/svg%3E")`

/* ─── Pricing ──────────────────────────────────────────────── */

export type Plan = {
  label: string
  price: string
  priceNote: string
  features: string[]
  highlight: boolean
}

export const PLANS: Plan[] = [
  {
    label: 'Free',
    price: 'GHS 0',
    priceNote: 'forever',
    features: ['1 bot', '50 messages / month', 'FAQ sources only', 'BotForge branding'],
    highlight: false,
  },
  {
    label: 'Starter',
    price: 'GHS 120',
    priceNote: '/ month',
    features: ['2 bots', '1,000 messages / month', 'All source types', 'No branding'],
    highlight: true,
  },
  {
    label: 'Pro',
    price: 'GHS 300',
    priceNote: '/ month',
    features: ['5 bots', '5,000 messages / month', 'All source types', 'WhatsApp integration'],
    highlight: false,
  },
  {
    label: 'Agency',
    price: 'GHS 700',
    priceNote: '/ month',
    features: ['Unlimited bots', '20,000 messages / month', 'All source types', 'White-label widget'],
    highlight: false,
  },
]

/* ─── Features ─────────────────────────────────────────────── */

export type Feature = {
  icon: LucideIcon
  title: string
  desc: string
  color: string
}

export const FEATURES: Feature[] = [
  {
    icon: Zap,
    title: 'Instant Setup',
    desc: 'Go from zero to a live AI support bot in under 30 minutes — no developers needed.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Globe,
    title: 'Embed Anywhere',
    desc: 'One line of code deploys your bot to any website, landing page, or web app.',
    color: 'from-sky-500 to-blue-600',
  },
  {
    icon: Bot,
    title: 'Train on Your Content',
    desc: 'Upload PDFs, paste URLs, or write FAQs — your bot learns your business instantly.',
    color: 'from-[#6C47FF] to-[#4F35CC]',
  },
  {
    icon: ShieldCheck,
    title: 'Always On',
    desc: 'Your AI agent works 24/7, handling customer questions while you focus on growth.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    desc: 'Track conversations, capture leads, and understand what your customers need.',
    color: 'from-pink-500 to-rose-600',
  },
  {
    icon: Users,
    title: 'Lead Capture',
    desc: 'Automatically collect visitor details and grow your customer list effortlessly.',
    color: 'from-[#6C47FF] to-purple-600',
  },
]

/* ─── How it works steps ───────────────────────────────────── */

export type Step = {
  icon: LucideIcon
  title: string
  desc: string
  step: string
}

export const STEPS: Step[] = [
  {
    icon: MessageSquare,
    title: 'Add your content',
    desc: 'Upload FAQs, paste URLs, or add PDFs. BotForge turns your content into AI knowledge instantly.',
    step: '01',
  },
  {
    icon: Settings,
    title: 'Configure your bot',
    desc: "Set your bot's name, personality, and fallback response. Make it sound exactly like your brand.",
    step: '02',
  },
  {
    icon: Code2,
    title: 'Embed anywhere',
    desc: 'Copy one line of code and paste it into your website. Your AI support bot goes live in seconds.',
    step: '03',
  },
]

/* ─── Testimonials ─────────────────────────────────────────── */

export type Testimonial = {
  name: string
  role: string
  company: string
  avatar: string
  color: string
  text: string
  stars: number
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Ama Asante',
    role: 'E-commerce Owner',
    company: 'Kente Store GH',
    avatar: 'AA',
    color: 'bg-[#6C47FF]',
    text: 'BotForge cut our support emails by 60% in the first week. Customers get instant answers and our team focuses on what matters.',
    stars: 5,
  },
  {
    name: 'Kwame Mensah',
    role: 'Founder',
    company: 'TechBridge Africa',
    avatar: 'KM',
    color: 'bg-[#4F35CC]',
    text: 'Setup took literally 20 minutes. We trained the bot on our docs and it handles onboarding questions better than we expected.',
    stars: 5,
  },
  {
    name: 'Abena Osei',
    role: 'Digital Agency Lead',
    company: 'Pixel Wave Studio',
    avatar: 'AO',
    color: 'bg-emerald-600',
    text: 'The white-label feature is a game changer. We deploy branded bots for all our clients under the Agency plan. Incredible ROI.',
    stars: 5,
  },
]

/* ─── Stats ────────────────────────────────────────────────── */

export type Stat = {
  value: string
  label: string
}

export const STATS: Stat[] = [
  { value: '10,000+', label: 'Messages handled daily' },
  { value: '500+', label: 'Active businesses' },
  { value: '30 min', label: 'Average setup time' },
  { value: '99.9%', label: 'Uptime guarantee' },
]
