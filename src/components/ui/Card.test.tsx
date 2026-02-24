import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Card, CardTitle, CardContent } from './Card'

describe('Card Component', () => {
  it('renders card with title and content', () => {
    render(
      <Card>
        <CardTitle>Product Title</CardTitle>
        <CardContent>Product description goes here.</CardContent>
      </Card>
    )
    expect(screen.getByText('Product Title')).toBeInTheDocument()
    expect(screen.getByText('Product description goes here.')).toBeInTheDocument()
  })

  it('applies custom classes', () => {
    render(<Card className="custom-class">Content</Card>)
    const card = screen.getByText('Content')
    expect(card.className).toContain('custom-class')
  })
})
