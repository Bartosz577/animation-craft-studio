import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Library — Animation Craft Studio',
}

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
