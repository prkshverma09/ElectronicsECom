import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { algoliasearch } from 'algoliasearch';

const mockGetObject = vi.fn().mockResolvedValue({
  objectID: '1',
  name: 'Sony WH-1000XM5',
  brand: 'Sony',
  price: 398,
  image: 'test.jpg',
  description: 'Best headphones'
});

vi.mock('algoliasearch', () => ({
  algoliasearch: vi.fn(() => ({
    getObject: mockGetObject,
  })),
}));

describe('Product Detail API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID = 'test';
    process.env.ALGOLIA_ADMIN_API_KEY = 'test';
  });

  it('should return a product by ID', async () => {
    const params = Promise.resolve({ id: '1' });
    const response = await GET(new Request('http://localhost'), { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.name).toBe('Sony WH-1000XM5');
  });

  it('should return 404 if product not found', async () => {
    const error = new Error('Not Found');
    (error as any).status = 404;
    mockGetObject.mockRejectedValueOnce(error);

    const params = Promise.resolve({ id: '999' });
    const response = await GET(new Request('http://localhost'), { params });
    expect(response.status).toBe(404);
  });
});
