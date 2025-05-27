"use server";

import { getErrorMessage } from '@/utils/getErrorMessage';

type TOptions = {
  wishlistId: ID;
  productIds: RoA<ID>;
  deleteWishlist?: boolean;
};

// Add multiple products to the user's cart
export const addProductsToCart = async ({
  productIds,
  wishlistId,
  deleteWishlist = false,
}: TOptions) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/cart/add-multiple`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds, wishlistId, deleteWishlist }),
      }
    );

    return await res.json();
  } catch (error) {
    throw new Error(getErrorMessage(error, "Failed to add products to cart"));
  }
};
