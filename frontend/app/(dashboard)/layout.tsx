import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { Toaster } from '@/components/ui/sonner'
import { OnboardingWizard } from '@/components/OnboardingWizard'
import { SidebarProvider } from '@/components/layout/SidebarContext'
import { CommandPalette } from '@/components/CommandPalette'
import { PageTransition } from '@/components/PageTransition'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-[#F8F8FF] dark:bg-[#0E0820]">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-4 pb-16 sm:p-8 sm:pb-20 mb-5">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
        <Toaster />
        <OnboardingWizard />
        <CommandPalette />
      </div>
    </SidebarProvider>
  )
}
