"use server";

import { revalidateTag } from 'next/cache';

/**
 * Delete a wishlist
 */
export const deleteWishlist = async (wishlistId: ID) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlists/${wishlistId}`,
    { method: "DELETE" }
  );

  // Invalidate the cache for list of wishlists
  revalidateTag(`wishlists`);

  return await res.json();
};
