# Manual Testing Guide for ElectronicsECom

This guide outlines the critical user flows for manually testing the ElectronicsECom application. Follow these instructions to verify that the core functionality, UI components, and AI integrations are working seamlessly in your local or deployed environment.

## 0. Prerequisites & Setup

Before beginning the manual testing, ensure the application is running correctly:

1. **Environment Variables:** Verify that your `.env` file contains the correct Algolia keys (`NEXT_PUBLIC_ALGOLIA_APP_ID`, `NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY`, `ALGOLIA_ADMIN_API_KEY`).
2. **Start the Server:** Run the development server using `npm run dev` and navigate to `http://localhost:3000` (or the port specified by Next.js).
3. **Seed Data (If necessary):** Ensure your Algolia index is populated. You can run `npx tsx scripts/seed-algolia.ts` if the search index is empty.

---

## 1. The Core Discovery Flow (Search & Browse)

**Objective:** Verify that a user can browse products and use the search functionality to find specific items.

**Steps:**
1. **Navigate to the Homepage (`/`):** Ensure the landing page loads correctly, the header is visible, and the branding is present.
2. **Go to the Shop Page:** Click the "Shop" link in the header navigation.
3. **Verify Initial Product Load:** The `/shop` page should display a list of premium product cards. Verify the images, titles, pricing, and "Add to Cart" buttons render correctly.
4. **Test the Search Bar:**
   - Locate the search bar at the top of the Shop page.
   - Type a query like `"Sony"` or `"Headphones"`.
   - **Expected behavior:** As you type, the product grid should update dynamically (with a slight debounce) to show only relevant results from Algolia.
5. **Empty State Verification:** Type a nonsense query like `"xyz123"`. Verify that the page handles it gracefully by showing a "No products found" message instead of crashing.

---

## 2. The Conversational Shopping Flow (AI Chatbot)

**Objective:** Verify the AI Assistant can answer questions contextually and recommend products using the Algolia Agent Studio integration.

**Steps:**
1. **Toggle the Chat Widget:** Click the floating chat bubble in the bottom right corner of the screen (available on any page).
2. **Initial Rendering:** Ensure the chat window opens smoothly, displaying the "AI Assistant" header and an initial greeting if applicable.
3. **Ask a General Question:** Type and send: `"What kind of products do you sell?"`
   - **Expected behavior:** The AI should reply indicating it sells electronics like laptops, headphones, etc.
4. **Ask for a Recommendation:** Type and send: `"Do you have any noise-canceling headphones from Sony?"`
   - **Expected behavior:** The AI should search the index and reply with recommendations, specifically mentioning the "Sony WH-1000XM5".
5. **Rich UI Iteration:** If the Agent Studio returns product recommendations as UI cards (if configured in your agent), verify that the mini product cards render correctly inside the chat bubble.
6. **Closing the Widget:** Click the "X" button in the chat header to ensure it minimizes correctly and retains conversation history when re-opened.

---

## 3. Product Details Flow (PDP)

**Objective:** Verify that detailed product information is fetched and displayed correctly via the Server Components.

**Steps:**
1. **Navigate to a PDP:** Go to the Shop page and click on any product card (e.g., the Sony Headphones).
2. **Verify URL:** Ensure the URL changes to `/product/[objectID]` (e.g., `/product/1`).
3. **Verify Content:** The page should display:
   - A large, clear product image.
   - The product brand, name, and a formatted price.
   - A detailed description.
   - Mock reviews/stars.
   - Trust indicators (shipping, warranty).
4. **Interactive Actions:**
   - Click the "Add to Cart" button. Ensure the toast notification fires ("Added to cart").
   - Click the "Add to Wishlist" button (Heart icon). Ensure the toast notification fires ("Added to wishlist").
5. **Back Navigation:** Click the "Back to Shop" button and ensure it returns you to the `/shop` route without losing overall application state.

---

## 4. Mobile Responsiveness Check

**Objective:** Ensure the premium aesthetic translates to smaller viewports.

**Steps:**
1. Open your browser's Developer Tools and toggle the Device Toolbar (or resize the browser window to mobile width).
2. **Header:** Verify that the desktop navigation links hide and the hamburger menu icon appears.
3. **Product Grid:** Ensure the grid on `/shop` collapses to a single column.
4. **Chat Widget:** Open the chat widget on mobile layout. It should take up most of the screen gracefully without overflowing the viewport.
5. **PDP Layout:** Verify that the product image and details stack vertically on the Product Details page instead of sitting side-by-side.
