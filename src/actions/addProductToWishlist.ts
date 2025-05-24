"use server";

type TOptions = {
  userId: ID;
  wishlistId: ID;
  productId: ID;
};

export const addProductToWishlist = async ({
  productId,
  userId,
  wishlistId,
}: TOptions) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlists/${userId}/${wishlistId}/products/${productId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to add to wishlist");
  }
  return await res.json();
};
