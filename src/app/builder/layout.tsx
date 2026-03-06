import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Builder — Animation Craft Studio',
}

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
