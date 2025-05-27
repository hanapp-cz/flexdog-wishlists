"use server";

import { getErrorMessage } from '@/utils/getErrorMessage';

type TOptions = {
  wishlistId: ID;
  productId: ID;
};

// Add a product to a user's wishlist
export const addProductToWishlist = async ({
  productId,
  wishlistId,
}: TOptions) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlists/${wishlistId}/products/${productId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      }
    );

    return await res.json();
  } catch (error) {
    throw new Error(
      getErrorMessage(error, "Failed to add product to wishlist")
    );
  }
};
