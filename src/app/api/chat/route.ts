import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const ALGOLIA_APP_ID = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "";
  const ALGOLIA_ADMIN_API_KEY = process.env.ALGOLIA_ADMIN_API_KEY || "";
  const ALGOLIA_AGENT_ID = process.env.NEXT_PUBLIC_ALGOLIA_AGENT_ID || "";

  if (!ALGOLIA_APP_ID || !ALGOLIA_ADMIN_API_KEY || !ALGOLIA_AGENT_ID) {
    return NextResponse.json(
      { error: "Algolia configuration missing" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();

    // Algolia Agent Studio API endpoint (Conversations)
    // Note: The specific versioning /v1/ or /1/ depends on the Beta state.
    // Standard Algolia headers: x-algolia-application-id and x-algolia-api-key
    const response = await fetch(
      `https://${ALGOLIA_APP_ID}.algolia.net/agent-studio/1/agents/${ALGOLIA_AGENT_ID}/completions?compatibilityMode=ai-sdk-4`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-algolia-application-id": ALGOLIA_APP_ID,
          "x-algolia-api-key": ALGOLIA_ADMIN_API_KEY,
        },
        body: JSON.stringify({
          messages: [{ id: "msg_1", role: "user", content: body.message }]
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Algolia Agent Error:", errorData);
      return NextResponse.json(
        { error: "Algolia Agent error", details: errorData },
        { status: response.status }
      );
    }

    const rawText = await response.text();
    const lines = rawText.split('\n');
    let fullText = "";
    let products: any[] = [];

    for (const line of lines) {
      if (line.startsWith('0:')) {
        try {
          fullText += JSON.parse(line.substring(2));
        } catch(e) {}
      } else if (line.startsWith('a:')) {
        try {
          const toolRes = JSON.parse(line.substring(2));
          if (toolRes.result && toolRes.result.hits) {
            products.push(...toolRes.result.hits);
          }
        } catch(e) {}
      }
    }

    return NextResponse.json({
      message: { text: fullText },
      data: { hits: products }
    });
  } catch (error: any) {
    console.error("Chat Proxy Error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request", details: error.message },
      { status: 500 }
    );
  }
}
