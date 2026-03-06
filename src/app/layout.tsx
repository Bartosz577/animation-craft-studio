import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { ToastContainer } from '@/components/ui/Toast'
import Navigation from '@/components/ui/Navigation'
import LenisProvider from '@/components/providers/LenisProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Animation Craft Studio',
  description:
    'Build award-level animated websites with AI-powered prompts',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark">
          <LenisProvider />
          <Navigation />
          <div style={{ paddingTop: 64 }}>{children}</div>
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  )
}
