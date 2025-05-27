import { readJSON } from './fileUtils';

type TOptions = {
  wishlistId: ID;
  userId: Nullable<ID>;
};

export const checkUserAccess = async ({ userId, wishlistId }: TOptions) => {
  if (!userId) {
    return { isAuthorized: false, userIndex: null } as const;
  }

  const userIndex = await readJSON("wishlist/user-index.json");
  const userWishlists = userIndex[userId] || [];
  const isMatch = userWishlists.includes(wishlistId);

  if (!isMatch) {
    return { isAuthorized: false, userIndex: null } as const;
  }

  return { isAuthorized: true, userIndex } as const;
};
