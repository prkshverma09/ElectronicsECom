import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { algoliasearch } from 'algoliasearch';

vi.mock('algoliasearch', () => ({
  algoliasearch: vi.fn(() => ({
    search: vi.fn().mockResolvedValue({
      results: [{ hits: [{ objectID: '1', name: 'Test Product' }] }]
    }),
  })),
}));

describe('Search API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID = 'test';
    process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY = 'test';
  });

  it('should return search results', async () => {
    const request = new Request('http://localhost/api/search', {
      method: 'POST',
      body: JSON.stringify({ query: 'laptop' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.results).toHaveLength(1);
    expect(data.results[0].name).toBe('Test Product');
  });

  it('should return error if config is missing', async () => {
    delete process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
    const request = new Request('http://localhost/api/search', {
      method: 'POST',
      body: JSON.stringify({ query: 'laptop' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(500);
  });
});
