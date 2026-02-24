# Product Requirements Document (PRD)
## AI-Powered Electronics E-Commerce Platform

### 1. Overview
The goal of this project is to build a modern, high-performance electronics e-commerce platform. It leverages curated datasets for product data and images, integrates Algolia for semantic search, and features an intelligent AI Chatbot to assist users in discovering the perfect electronic products to meet their needs. The platform will be deployed on Vercel ensuring lightning-fast global delivery.

### 2. Dataset Selection & Sourcing
To populate our catalog with realistic products, rich descriptions, and high-quality images, we have evaluated several prominent open datasets. Since our application relies heavily on **Semantic Search** and an **AI Chatbot**, datasets with comprehensive textual descriptions and clear image URLs are mandatory.

**Recommended Datasets:**

1.  **Amazon Berkeley Objects (ABO) Dataset / Amazon Product Data (by Julian McAuley)**
    *   **Source:** Available via AWS Registry of Open Data and academic repositories (often cited/used in Kaggle notebooks).
    *   **Features:** Contains millions of Amazon products. The "Electronics" subset includes high-resolution images, detailed product descriptions, pricing, and brand information.
    *   **Why it fits:** The descriptions are usually very long and feature-rich (e.g., "noise-canceling," "battery life 30h"), which makes it the absolute best choice for Algolia's vector/semantic search and the RAG-based AI Chatbot.
2.  **Flipkart E-Commerce Dataset**
    *   **Source:** Multiple variations on Kaggle (e.g., the popular 20,000 product sample).
    *   **Features:** Includes product name, retail price, discounted price, image URLs, product descriptions, and category trees.
    *   **Why it fits:** It is clean, easy to parse (usually a single CSV), and contains direct HTTP URLs to product images, meaning we don't necessarily have to host the massive image files ourselves initially.
3.  **ecommerce_product_images_18K**
    *   **Source:** Kaggle.
    *   **Features:** ~18K images categorized into precise classes (including electronics/gadgets).
    *   **Why it fits:** Great for computer vision, but lacks the deep text descriptions needed for advanced semantic search. Better used as a fallback if the others are unavailable.

**Data Strategy:**
We recommend proceeding with a subset (e.g., 5,000 - 10,000 rows) of the **Amazon Product Data** or the **Flipkart E-Commerce Dataset**.
We will write a script to extract the Name, Description, Price, Brand, and Image URLs, normalize them into a JSON format, and push these records directly to an Algolia Index. If the dataset provides raw image files instead of URLs, we will upload them to Vercel Blob Storage and store the resulting URLs in Algolia.

### 3. Core Features & Requirements

#### 3.1. Algolia Semantic Indexing & Search
*   **Requirement:** All electronics products must be indexed in Algolia.
*   **Functionality:**
    *   Full-text, typo-tolerant keyword search.
    *   Semantic/Vector search processing querying the context of items (e.g., "headphones for running").
    *   Faceted filtering by category, price range, and brand.

#### 3.2. AI-Powered Shopping Assistant (Chatbot)
*   **Requirement:** A conversational UI embedded within the web app.
*   **Functionality:**
    *   **Retrieval-Augmented Recommendations (RAG):** The AI will understand user requests and automatically query the Algolia index via function-calling to retrieve exact product matches.
    *   **Conversational Guidance:** Helps users narrow down choices by asking clarifying questions (e.g., "Do you prefer over-ear or in-ear?").
    *   Rich UI responses showing product cards directly within the chat window.

#### 3.3. Premium UI/UX Design Aesthetic
*   **Requirement:** The application must deliver a "wow" factor upon load.
*   **Key Design Elements:**
    *   Vibrant, tailored HSL color palettes or a sleek, high-contrast Dark Mode.
    *   Glassmorphism (frosted glass effects) on the Chatbot UI and navigation elements.
    *   Micro-animations (hover effects, smooth page transitions, stagger-loaded grids) to make the experience feel alive and premium.
    *   Modern Web Typography (e.g., Inter, Outfit).

### 4. Technical Stack
*   **Frontend / Fullstack Framework:** Next.js (App Router) for Server-Side Rendering (SSR) and seamless API routing.
*   **Hosting:** Vercel.
*   **Database / Search Engine:** Algolia (Search & Discovery Platform).
*   **AI Integration:** Vercel AI SDK paired with OpenAI/Anthropic models for seamless edge-ready streaming chat.
*   **Styling:** Modern Vanilla CSS (with CSS variables and utility classes) or Tailwind CSS (if preferred) for robust, responsive layouts.
*   **Data Ingestion Scripting:** Python or Node.js scripts for parsing Kaggle CSV/JSON, uploading images, and pushing records to Algolia.

### 5. Implementation Phases

*   **Phase 1: Data Preparation:** Source the Kaggle dataset, normalize the schema, and upload images to a CDN.
*   **Phase 2: Search Infrastructure:** Push structured data to an Algolia Index and configure relevance rules + vector search.
*   **Phase 3: Web Scaffold & Design:** Initialize the Next.js project on Vercel, establish the design system, and build the dynamic product catalog and Product Details Page (PDP).
*   **Phase 4: NextJS x Algolia Integration:** Connect the frontend to Algolia to power the catalog view and search bar.
*   **Phase 5: AI Chatbot Development:** Build the AI route using Vercel AI SDK, configure its context and tool-use to interact with Algolia, and design the chat UI widget.
*   **Phase 6: Polish & Launch:** End-to-end testing, Lighthouse performance auditing, SEO optimization, and final deployment.
