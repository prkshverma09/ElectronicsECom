import { describe, it, expect, vi, beforeEach } from 'vitest';
import { seedAlgolia } from './seed-algolia';
import { algoliasearch } from 'algoliasearch';

const mockSaveObjects = vi.fn().mockResolvedValue([{ taskID: 'mock-task-id' }]);

// Mock algoliasearch
vi.mock('algoliasearch', () => ({
  algoliasearch: vi.fn(() => ({
    saveObjects: mockSaveObjects,
  })),
}));

describe('seedAlgolia', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID = 'test-id';
    process.env.ALGOLIA_ADMIN_API_KEY = 'test-key';
  });

  it('should call saveObjects with products from the json file', async () => {
    const taskID = await seedAlgolia();
    expect(taskID).toBe('mock-task-id');

    expect(mockSaveObjects).toHaveBeenCalledWith(expect.objectContaining({
      indexName: 'products',
      objects: expect.arrayContaining([
        expect.objectContaining({ brand: 'Sony' })
      ]),
    }));
  });

  it('should warn and exit if env vars are missing', async () => {
    delete process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await seedAlgolia();
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Algolia environment variables are missing'));
  });
});
