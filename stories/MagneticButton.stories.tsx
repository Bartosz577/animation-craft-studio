import type { Meta, StoryObj } from '@storybook/react'
import MagneticButton from '../src/components/animations/MagneticButton'

const meta: Meta<typeof MagneticButton> = {
  title: 'Animations/MagneticButton',
  component: MagneticButton,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof MagneticButton>

export const Default: Story = {
  args: {
    strength: 0.4,
  },
  render: (args) => (
    <div style={{ padding: '8rem', background: '#050505' }}>
      <MagneticButton {...args}>
        <span
          style={{
            display: 'inline-block',
            padding: '1rem 2.5rem',
            background: '#a0ff60',
            color: '#050505',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 600,
          }}
        >
          Hover &amp; Move
        </span>
      </MagneticButton>
    </div>
  ),
}
