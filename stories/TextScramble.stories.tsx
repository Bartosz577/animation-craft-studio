import type { Meta, StoryObj } from '@storybook/react'
import TextScramble from '../src/components/animations/TextScramble'

const meta: Meta<typeof TextScramble> = {
  title: 'Animations/TextScramble',
  component: TextScramble,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof TextScramble>

export const Default: Story = {
  args: {
    text: 'Animation Craft Studio',
    trigger: 'mount',
  },
  render: (args) => (
    <div style={{ padding: '4rem', background: '#050505' }}>
      <span style={{ fontSize: '2rem', fontFamily: 'monospace', color: '#f0f0f0' }}>
        <TextScramble {...args} />
      </span>
    </div>
  ),
}

export const OnHover: Story = {
  args: {
    text: 'Hover me to scramble',
    trigger: 'hover',
  },
  render: (args) => (
    <div style={{ padding: '4rem', background: '#050505' }}>
      <span style={{ fontSize: '2rem', fontFamily: 'monospace', color: '#a0ff60', cursor: 'pointer' }}>
        <TextScramble {...args} />
      </span>
    </div>
  ),
}
