"use server";

/**
 * Fetch all wishlists for a user
 */
export const getWishlists = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/wishlists`, {
    next: { tags: [`wishlists`] },
  });

  return await res.json();
};
