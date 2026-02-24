import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Input } from './Input'

describe('Input Component', () => {
  it('renders correctly', () => {
    render(<Input placeholder="Search products..." />)
    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument()
  })

  it('handles change events', () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'laptop' } })
    expect(handleChange).toHaveBeenCalled()
  })

  it('is disabled when the disabled prop is passed', () => {
    render(<Input disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })
})
