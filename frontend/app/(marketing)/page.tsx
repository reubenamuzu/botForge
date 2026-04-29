'use client'

import { useEffect } from 'react'
import Navbar from '@/components/marketing/Navbar'
import HeroSection from '@/components/marketing/HeroSection'
import LogosBar from '@/components/marketing/LogosBar'
import HowItWorksSection from '@/components/marketing/HowItWorksSection'
import FeaturesSection from '@/components/marketing/FeaturesSection'
import LiveDemoSection from '@/components/marketing/LiveDemoSection'
import PricingSection from '@/components/marketing/PricingSection'
import StatsSection from '@/components/marketing/StatsSection'
import TestimonialsSection from '@/components/marketing/TestimonialsSection'
import FAQSection from '@/components/marketing/FAQSection'
import CtaBanner from '@/components/marketing/CtaBanner'
import Footer from '@/components/marketing/Footer'

export default function LandingPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0 }
    )
    document
      .querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-up')
      .forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-[#F8F8FF] dark:bg-[#0E0820] text-[#1A1035] dark:text-[#F4F1FF] antialiased">
      <Navbar />
      <HeroSection />
      <LogosBar />
      <HowItWorksSection />
      <FeaturesSection />
      <LiveDemoSection />
      <PricingSection />
      <StatsSection />
      <TestimonialsSection />
      <FAQSection />
      <CtaBanner />
      <Footer />
    </div>
  )
}
