"use server";

import { revalidateTag } from 'next/cache';

type TOptions = {
  userId: ID;
  wishlistId: ID;
};

/**
 * Delete a wishlist
 */
export const deleteWishlist = async ({ userId, wishlistId }: TOptions) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlists/${userId}/${wishlistId}`,
    {
      method: "DELETE",
    }
  );

  // Invalidate the cache for list of wishlists
  revalidateTag(`wishlists`);

  return await res.json();
};
