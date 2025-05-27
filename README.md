## 🌍 Project Overview

This project is a Next.js application that demonstrates a complete wishlist management system for users.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

API is built using [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/api-routes).
It is designed for testing & demonstrating purposes only as fetching in server components from api routes is not the right way to do it. See the [Next.js FAQ](https://nextjs-faq.com/fetch-api-in-rsc) for more details.

### ✨ Features

- **User Wishlists:** Users can create, view, update (rename/describe), and delete wishlists.
- **Product Management:** Add products to wishlists, remove them, and move products between wishlists.
- **Wishlist Overview & Detail:** View all wishlists with summary info, and see detailed product data for each wishlist.
- **Price Tracking:** Detect and display if a product’s price has increased since it was added to a wishlist.
- **Sharing Wishlists:** Share wishlists with others via a unique URL.
- **Adding to Cart:** Users can add products to their cart directly from the wishlist.

### 💻 Tech Stack

- [Next.js](https://nextjs.org) (App Router)
- React
- TypeScript
- TailwindCSS
- [Radix UI](https://www.radix-ui.com/) & [shadcn/ui](https://ui.shadcn.com/) for UI components

## 👩‍💻 Run Project Locally

1. First install dependencies:

```bash
npm install
```

2. Then add environment variables to your `.env.local` file based on the `.env.template` file

3. Run the development server:

```bash
npm run dev
```
