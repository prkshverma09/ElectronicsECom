import { NextResponse } from "next/server";
import { algoliasearch } from "algoliasearch";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "";
  const ALGOLIA_ADMIN_API_KEY = process.env.ALGOLIA_ADMIN_API_KEY || "";
  const ALGOLIA_INDEX_NAME = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || "products";

  const { id } = await params;

  if (!ALGOLIA_APP_ID || !ALGOLIA_ADMIN_API_KEY) {
    return NextResponse.json(
      { error: "Algolia configuration missing" },
      { status: 500 }
    );
  }

  try {
    const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY);
    const product = await client.getObject({
      indexName: ALGOLIA_INDEX_NAME,
      objectID: id,
    });

    return NextResponse.json(product);
  } catch (error: any) {
    const status = error.status || error.statusCode;
    if (status === 404) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    console.error("Fetch Product Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
