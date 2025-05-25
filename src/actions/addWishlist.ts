"use server";

import { revalidateTag } from 'next/cache';

import { TWishListMetadata } from '@/types/wishlists.types';
import { getErrorMessage } from '@/utils/getErrorMessage';

type TOptions = {
  userId: ID;
  wishlistData: Partial<TWishListMetadata>;
};

/**
 * Add a new wishlist for a user
 */
export const addWishlist = async ({ userId, wishlistData }: TOptions) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlists/${userId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(wishlistData),
      }
    );

    const result = await response.json();

    if (result.data) {
      revalidateTag(`wishlists`);
    }

    return result;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to add wishlist"));
  }
};
