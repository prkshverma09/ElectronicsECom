import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ShopPage from './page'

// Mock fetch
global.fetch = vi.fn()

describe('ShopPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(global.fetch as any).mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        results: [
          {
            objectID: '1',
            name: 'Test Laptop',
            brand: 'TestBrand',
            price: 1000,
            image: '/test.jpg',
            description: 'Test desc'
          }
        ]
      })
    })
  })

  it('renders shop header and searchbar', async () => {
    render(<ShopPage />)
    expect(screen.getByText('Discover Components')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search for electronics...')).toBeInTheDocument()
  })

  it('fetches and displays products', async () => {
    render(<ShopPage />)

    await waitFor(() => {
      expect(screen.getByText('Test Laptop')).toBeInTheDocument()
    })
    expect(screen.getByText('$1,000.00')).toBeInTheDocument()
  })

  it('handles search query changes', async () => {
    render(<ShopPage />)
    const input = screen.getByPlaceholderText('Search for electronics...')

    fireEvent.change(input, { target: { value: 'headphones' } })

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/search',
        expect.objectContaining({
          body: JSON.stringify({ query: 'headphones' })
        })
      )
    })
  })
})
