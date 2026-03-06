import type { Meta, StoryObj } from '@storybook/react'
import ParallaxSection from '../src/components/animations/ParallaxSection'

const meta: Meta<typeof ParallaxSection> = {
  title: 'Animations/ParallaxSection',
  component: ParallaxSection,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof ParallaxSection>

export const Default: Story = {
  args: {
    speed: 0.3,
    direction: 'up',
  },
  render: (args) => (
    <div style={{ background: '#050505' }}>
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#888', fontSize: '1.25rem' }}>Scroll down to see parallax</p>
      </div>
      <ParallaxSection {...args}>
        <div
          style={{
            height: '400px',
            background: 'linear-gradient(135deg, #a0ff60 0%, #4a8a20 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 2rem',
          }}
        >
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#050505' }}>
            Parallax Content
          </h2>
        </div>
      </ParallaxSection>
      <div style={{ height: '100vh' }} />
    </div>
  ),
}
