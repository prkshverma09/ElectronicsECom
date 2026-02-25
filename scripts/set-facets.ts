import { algoliasearch } from 'algoliasearch';
import * as dotenv from 'dotenv';
dotenv.config();

const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '';
const ALGOLIA_ADMIN_API_KEY = process.env.ALGOLIA_ADMIN_API_KEY || '';
const ALGOLIA_INDEX_NAME = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'products';

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY);

async function setSettings() {
  try {
    await client.setSettings({
      indexName: ALGOLIA_INDEX_NAME,
      indexSettings: {
        attributesForFaceting: ['category', 'brand']
      }
    });
    console.log("Successfully updated index settings for faceting!");
  } catch (error) {
    console.error("Failed to update index settings:", error);
  }
}

setSettings();
