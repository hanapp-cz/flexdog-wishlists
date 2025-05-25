"use server";

import { revalidateTag } from 'next/cache';

import { getErrorMessage } from '@/utils/getErrorMessage';

type TOptions = {
  userId: ID;
  wishlistId: ID;
  productId: ID;
};

/**
 * Remove a product from a user's wishlist
 */
export const removeProductFromWishlist = async ({
  productId,
  userId,
  wishlistId,
}: TOptions) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlists/${userId}/${wishlistId}/products/${productId}`,
      {
        method: "DELETE",
      }
    );

    // Invalidate the cache for this wishlist
    revalidateTag(`wishlist-${wishlistId}`);

    return await res.json();
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Failed to remove product from wishlist")
    );
  }
};
