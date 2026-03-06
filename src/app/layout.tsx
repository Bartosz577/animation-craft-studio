import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import './globals.css'

export const metadata: Metadata = {
  title: 'Animation Craft Studio',
  description:
    'Build award-level animated websites with AI-ready animation components',
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
