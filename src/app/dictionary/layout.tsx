import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dictionary — Animation Craft Studio',
}

export default function DictionaryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
