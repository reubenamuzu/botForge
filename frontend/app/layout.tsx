import type { Metadata } from 'next'
import { Inter, Instrument_Serif } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Providers } from '@/components/providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
})

export const metadata: Metadata = {
  title: 'BotForge',
  description: 'No-code AI customer support chatbot builder for Ghanaian businesses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider afterSignOutUrl="/sign-in">
      <html lang="en" suppressHydrationWarning className={`${inter.variable} ${instrumentSerif.variable}`}>
        <body className={inter.className}>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
