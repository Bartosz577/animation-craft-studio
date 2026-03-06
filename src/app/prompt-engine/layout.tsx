import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Prompt Engine — Animation Craft Studio',
}

export default function PromptEngineLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
