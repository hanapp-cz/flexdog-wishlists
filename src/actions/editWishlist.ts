"use server";

import { revalidateTag } from 'next/cache';

import { TWishListMetadata } from '@/types/wishlists.types';
import { getErrorMessage } from '@/utils/getErrorMessage';

type TOptions = {
  userId: ID;
  wishlistId: ID;
  wishlistData: Partial<TWishListMetadata>;
};

/**
 * Edit an existing wishlist
 */
export const editWishlist = async ({
  wishlistId,
  userId,
  wishlistData,
}: TOptions) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlists/${userId}/${wishlistId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(wishlistData),
      }
    );

    const result = await response.json();

    if (result.data) {
      revalidateTag(`wishlist-${wishlistId}`);
    }

    return result;
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to edit wishlist"));
  }
};
