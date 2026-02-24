import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Header } from './Header'

describe('Header Component', () => {
  it('renders logo link', () => {
    render(<Header />)
    expect(screen.getAllByText('ElectronicsEcom')[0]).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<Header />)
    expect(screen.getByText('Shop')).toBeInTheDocument()
    expect(screen.getByText('Categories')).toBeInTheDocument()
  })
})
