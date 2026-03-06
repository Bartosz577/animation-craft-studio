import type { Meta, StoryObj } from '@storybook/react'
import TextSplitReveal from '../src/components/animations/TextSplitReveal'

const meta: Meta<typeof TextSplitReveal> = {
  title: 'Animations/TextSplitReveal',
  component: TextSplitReveal,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof TextSplitReveal>

export const Default: Story = {
  args: {
    text: 'Animation Craft',
    as: 'h1',
  },
  render: (args) => (
    <div style={{ padding: '4rem', background: '#050505', fontSize: '4rem', fontWeight: 800, color: '#f0f0f0' }}>
      <TextSplitReveal {...args} />
    </div>
  ),
}

export const AsHeading2: Story = {
  args: {
    text: 'Split Reveal Heading',
    as: 'h2',
  },
  render: (args) => (
    <div style={{ padding: '4rem', background: '#050505' }}>
      <TextSplitReveal {...args} />
    </div>
  ),
}
