import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';

describe('Chat API Route (Algolia Agent Proxy)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID = 'test-app-id';
    process.env.ALGOLIA_ADMIN_API_KEY = 'test-api-key';
    process.env.NEXT_PUBLIC_ALGOLIA_AGENT_ID = 'test-agent-id';

    // Mock global fetch
    global.fetch = vi.fn();
  });

  it('should proxy requests to Algolia and return success', async () => {
    const mockResponse = {
      conversation_id: 'conv-123',
      message: { text: 'Hello, how can I help you?' }
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: vi.fn().mockResolvedValue(mockResponse),
    });

    const request = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'Hi' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.conversation_id).toBe('conv-123');

    // Verify fetch was called with correct headers
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('test-agent-id/conversations'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'x-algolia-application-id': 'test-app-id',
          'x-algolia-api-key': 'test-api-key',
        })
      })
    );
  });

  it('should return error if Algolia fails', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: vi.fn().mockResolvedValue({ message: 'Invalid request' }),
    });

    const request = new Request('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: '' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
