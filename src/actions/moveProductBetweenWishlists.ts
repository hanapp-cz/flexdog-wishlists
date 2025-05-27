"use server";

import { revalidateTag } from 'next/cache';

type TOptions = {
  wishlistId: ID;
  productId: ID;
  toWishlistId: ID;
};

/**
 * Move a product from one wishlist to another
 */
export const moveProductBetweenWishlists = async ({
  productId,
  wishlistId,
  toWishlistId,
}: TOptions) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlists/${wishlistId}/products/${productId}/move-product`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, toWishlistId }),
    }
  );

  // Invalidate the cache for both wishlists
  revalidateTag(`wishlist-${wishlistId}`);
  revalidateTag(`wishlist-${toWishlistId}`);

  return await res.json();
};
