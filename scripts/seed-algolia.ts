import { algoliasearch } from 'algoliasearch';
import * as dotenv from 'dotenv';
import products from '../data/electronics.json';

dotenv.config();

export async function seedAlgolia() {
  const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '';
  const ALGOLIA_ADMIN_API_KEY = process.env.ALGOLIA_ADMIN_API_KEY || '';
  const ALGOLIA_INDEX_NAME = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'products';

  if (!ALGOLIA_APP_ID || !ALGOLIA_ADMIN_API_KEY) {
    console.warn('Algolia environment variables are missing. Skipping seed.');
    return;
  }

  const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY);

  try {
    const response = await client.saveObjects({
      indexName: ALGOLIA_INDEX_NAME,
      objects: products,
    });
    // In Algolia v5, saveObjects returns an array of responses
    const taskID = response[0]?.taskID;
    console.log(`Successfully indexed products. Task ID: ${taskID}`);
    return taskID;
  } catch (error) {
    console.error('Error seeding Algolia:', error);
    throw error;
  }
}

if (require.main === module) {
  seedAlgolia();
}
