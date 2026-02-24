import { NextResponse } from "next/server";
import { algoliasearch } from "algoliasearch";

export async function POST(request: Request) {
  const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "";
  const ALGOLIA_SEARCH_API_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || "";
  const ALGOLIA_INDEX_NAME = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || "products";

  try {
    const { query, filters } = await request.json();

    if (!ALGOLIA_APP_ID || !ALGOLIA_SEARCH_API_KEY) {
      return NextResponse.json(
        { error: "Algolia configuration missing" },
        { status: 500 }
      );
    }

    const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY);

    const { results } = await client.search({
      requests: [
        {
          indexName: ALGOLIA_INDEX_NAME,
          query: query || "",
          filters: filters || "",
        },
      ],
    });

    return NextResponse.json({ results: (results[0] as any).hits });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    );
  }
}
