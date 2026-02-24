import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ChatWidget from './ChatWidget'
import React from 'react'

// Mock fetch
global.fetch = vi.fn()

describe('ChatWidget Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders and toggles the chat window', async () => {
    render(<ChatWidget />)

    const toggleButton = screen.getByLabelText(/Toggle chat/i)
    expect(screen.queryByText(/AI Assistant/i)).not.toBeInTheDocument()

    // Open chat
    fireEvent.click(toggleButton)
    expect(screen.getByText(/AI Assistant/i)).toBeInTheDocument()

    // Close chat
    const closeButton = screen.getByLabelText(/Close chat/i)
    fireEvent.click(closeButton)
    await waitFor(() => {
      expect(screen.queryByText(/AI Assistant/i)).not.toBeInTheDocument()
    })
  })

  it('sends a message and displays assistant response', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue({
        message: { text: "I can help with that!" },
        data: { hits: [] }
      })
    })

    render(<ChatWidget />)
    fireEvent.click(screen.getByLabelText(/Toggle chat/i)) // Open

    const input = screen.getByPlaceholderText(/Ask about a product.../i)
    const sendButton = screen.getByLabelText(/Send message/i)

    fireEvent.change(input, { target: { value: 'Recommendations?' } })
    fireEvent.click(sendButton)

    // User message should appear
    expect(await screen.findByText('Recommendations?')).toBeInTheDocument()

    // Assistant response should appear after proxy call
    await waitFor(() => {
      expect(screen.getByText('I can help with that!')).toBeInTheDocument()
    }, { timeout: 2000 })
  })
})
