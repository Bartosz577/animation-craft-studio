import type { Meta, StoryObj } from '@storybook/react'
import HeroReveal from '../src/components/animations/HeroReveal'

const meta: Meta<typeof HeroReveal> = {
  title: 'Animations/HeroReveal',
  component: HeroReveal,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof HeroReveal>

export const Default: Story = {
  render: (args) => (
    <div style={{ padding: '4rem', background: '#050505', minHeight: '100vh' }}>
      <HeroReveal {...args}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#f0f0f0' }}>
          Animation Craft Studio
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#888' }}>
          Build award-level animated websites with production-ready components.
        </p>
        <button
          style={{
            padding: '0.75rem 2rem',
            background: '#a0ff60',
            color: '#050505',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Get Started
        </button>
      </HeroReveal>
    </div>
  ),
}
