"use server";

import { getErrorMessage } from '@/utils/getErrorMessage';

type TOptions = {
  wishlistId: ID;
  userId: ID;
};

/**
 * Get a specific wishlist for a user
 */
export const getWishlist = async ({ wishlistId, userId }: TOptions) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlists/${userId}/${wishlistId}`,
      {
        next: { tags: [`wishlist-${wishlistId}`] },
      }
    );

    return await response.json();
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to load wishlist"));
  }
};
