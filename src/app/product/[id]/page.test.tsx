import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ProductPage from './page'
import React from 'react'

// Mock fetch
global.fetch = vi.fn()

// Mock next/navigation
vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

describe('ProductPage Server Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
  })

  it('renders product details', async () => {
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        objectID: '1',
        name: 'Sony WH-1000XM5',
        brand: 'Sony',
        price: 398,
        image: '/headphones.jpg',
        description: 'Noise canceling headphones'
      })
    })

    const params = Promise.resolve({ id: '1' })
    const result = await ProductPage({ params })
    render(result)

    expect(screen.getByText('Sony WH-1000XM5')).toBeInTheDocument()
    expect(screen.getByText('Sony')).toBeInTheDocument()
    expect(screen.getByText(/\$398/)).toBeInTheDocument()
  })

  it('calls notFound on 404', async () => {
    ;(global.fetch as any).mockResolvedValue({
      ok: false,
      status: 404
    })

    const { notFound } = await import('next/navigation')
    const params = Promise.resolve({ id: '999' })

    try {
      await ProductPage({ params })
    } catch (e) {
      // notFound() throws in Next.js
    }

    expect(notFound).toHaveBeenCalled()
  })
})
