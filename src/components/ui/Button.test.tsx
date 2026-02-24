import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Button } from './Button'

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click Me</Button>)
    expect(screen.getByText('Click Me')).toBeInTheDocument()
  })

  it('applies variant classes correctly', () => {
    render(<Button variant="glass">Glass Button</Button>)
    const button = screen.getByText('Glass Button')
    expect(button.className).toContain('backdrop-blur-md')
  })

  it('triggers onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click Me</Button>)
    fireEvent.click(screen.getByText('Click Me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when the disabled prop is passed', () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByText('Disabled Button') as HTMLButtonElement
    expect(button.disabled).toBe(true)
  })
})
