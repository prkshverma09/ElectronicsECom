import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';
import { algoliasearch } from 'algoliasearch';
import Exa from 'exa-js';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '';
const ALGOLIA_ADMIN_API_KEY = process.env.ALGOLIA_ADMIN_API_KEY || '';
const ALGOLIA_INDEX_NAME = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'products';
const EXA_API_KEY = process.env.EXA_API_KEY || '';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

const exa = new Exa(EXA_API_KEY);
const algoliaClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY);
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

interface CsvRow {
  Title?: string;
  'Product Link'?: string;
  'Image URL'?: string;
  Price?: string;
  'Key Features'?: string;
  // Fallbacks for other possible column names
  name?: string;
  price?: string;
  image?: string;
  description?: string;
}

interface Product {
  [key: string]: unknown;
  objectID: string;
  name: string;
  description: string;
  brand: string;
  price: number;
  category: string;
  image: string;
  _vectors?: {
    description_vector: number[];
  };
}

async function fetchImageWithExa(query: string): Promise<string | null> {
  console.log(`Fetching image for "${query}" using Exa...`);
  try {
    const response = await exa.search(query + " product image", {
      type: 'keyword',
      numResults: 1,
      useAutoprompt: true
    });
    // Just a basic fallback to return *something*. Realistically Exa returns URLs to pages, not raw image URLs.
    // If we wanted to get image tags, we'd need to fetch and parse the page, but for now we'll just log it.
    console.log(`Exa search completed for "${query}":`, response.results.length ? response.results[0].url : 'No results');
    return null;
  } catch (error) {
    console.error(`Error querying Exa for image: ${error}`);
    return null;
  }
}

async function generateEmbedding(text: string): Promise<number[] | null> {
  if (!OPENAI_API_KEY) return null;
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
      encoding_format: "float",
      dimensions: 256,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error(`Error generating embedding: ${error}`);
    return null;
  }
}

function parsePrice(priceStr: string | undefined): number {
  if (!priceStr) return 0;
  const cleaned = priceStr.replace(/[^0-9.]/g, '');
  const inrPrice = parseFloat(cleaned) || 0;
  // Convert INR to USD (approximate rate 1 USD = 83 INR)
  const usdPrice = inrPrice / 83;
  return Math.round(usdPrice * 100) / 100;
}

function extractBrand(title: string | undefined): string {
  if (!title) return 'Unknown';
  return title.split(' ')[0]; // Basic brand extraction (e.g. "HP", "Apple", "Lenovo")
}

async function processFile(filePath: string, category: string): Promise<Product[]> {
  const products: Product[] = [];
  let index = 0;

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row: CsvRow) => {
        // limit to 50 products per category for quick ingestion
        if (products.length >= 50) return;

        const name = row.Title || row.name || '';
        if (!name) return;

        const price = parsePrice(row.Price || row.price);
        let description = row['Key Features'] || row.description || name;
        // Truncate to avoid Algolia 10KB record limit (vector takes up some space too)
        if (description.length > 2000) {
          description = description.substring(0, 2000) + '...';
        }

        const brand = extractBrand(name);
        const image = row['Image URL'] || row.image || '';

        const product: Product = {
          objectID: `${category.toLowerCase()}-${index++}`,
          name,
          description,
          brand,
          price,
          category,
          image
        };
        products.push(product);
      })
      .on('end', () => {
        resolve(products);
      })
      .on('error', reject);
  });
}

async function main() {
  if (!ALGOLIA_APP_ID || !ALGOLIA_ADMIN_API_KEY) {
    console.error('Missing Algolia credentials in .env');
    process.exit(1);
  }

  console.log('Starting ingestion process...');
  let allProducts: Product[] = [];

  const dataDir = path.join(process.cwd(), 'data/kaggle_dataset');
  if (fs.existsSync(dataDir)) {
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.csv'));

    for (const file of files) {
      const filePath = path.join(dataDir, file);
      // Determine category from filename
      let category = 'Electronics';
      if (file.toLowerCase().includes('laptop')) category = 'Laptops';
      if (file.toLowerCase().includes('mobile')) category = 'Smartphones';
      if (file.toLowerCase().includes('earphone')) category = 'Audio';

      console.log(`Processing ${file} as category ${category}...`);
      const products = await processFile(filePath, category);
      allProducts = allProducts.concat(products);
    }
  }

  console.log(`Processed ${allProducts.length} items from CSV...`);

  // Data augmentation with Exa for missing images (though Kaggle likely has them)
  const FALLBACK_IMAGE = 'https://dummyimage.com/600x400/cccccc/000000.png&text=No+Image';

  console.log('Fetching images and generating AI embeddings...');
  let processedCount = 0;

  for (const product of allProducts) {
    if (!product.image || product.image.trim() === '') {
      const exaImage = await fetchImageWithExa(`${product.brand} ${product.name}`);
      product.image = exaImage || FALLBACK_IMAGE;
    }

    // Generate vector embedding for NeuralSearch
    const textToEmbed = `${product.name} ${product.brand} ${product.category} ${product.description}`;
    const embedding = await generateEmbedding(textToEmbed);

    if (embedding) {
      product._vectors = {
        description_vector: embedding
      };
    }

    processedCount++;
    if (processedCount % 10 === 0) {
       console.log(`Processed ${processedCount}/${allProducts.length} items for augmentation.`);
    }
  }

  console.log(`Ready to save ${allProducts.length} objects to Algolia index: ${ALGOLIA_INDEX_NAME}`);

  try {
    const response = await algoliaClient.saveObjects({
      indexName: ALGOLIA_INDEX_NAME,
      objects: allProducts
    });
    console.log(`Successfully indexed ${allProducts.length} products. Task IDs: ${response[0]?.taskID}`);
  } catch (error) {
    console.error('Error seeding Algolia:', error);
  }
}

main().catch(console.error);
