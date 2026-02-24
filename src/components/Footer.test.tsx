import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Footer } from './Footer'

describe('Footer Component', () => {
  it('renders copyright and brand', () => {
    render(<Footer />)
    expect(screen.getAllByText(/ElectronicsEcom/)[0]).toBeInTheDocument()
    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument()
  })

  it('renders shop sections', () => {
    render(<Footer />)
    expect(screen.getByText('Laptops')).toBeInTheDocument()
    expect(screen.getByText('Support')).toBeInTheDocument()
  })
})
