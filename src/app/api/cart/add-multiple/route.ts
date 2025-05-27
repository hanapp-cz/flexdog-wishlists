import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { TProducts } from '@/types/products.types';
import { TWishlist } from '@/types/wishlists.types';
import { checkUserAccess } from '@/utils/checkUserAccess';
import {
  deleteFile,
  readJSON,
  writeJSON,
} from '@/utils/fileUtils';

type TBody = {
  wishlistId: ID;
  productIds: RoA<ID>;
  deleteWishlist: boolean;
};

type TData =
  | { data: { success: boolean }; error?: never }
  | { data: null; error: string };

export async function POST(request: NextRequest) {
  const userId = process.env.USER_ID ?? null;
  const { wishlistId, productIds, deleteWishlist }: TBody =
    await request.json();

  try {
    const { isAuthorized, userIndex } = await checkUserAccess({
      userId,
      wishlistId,
    });

    if (!userId || !isAuthorized) {
      return NextResponse.json<TData>(
        { error: "Not authenticated", data: null },
        { status: 401 }
      );
    }

    const allProducts: TProducts = await readJSON("products.json");
    const getProduct = getProductForCart(allProducts);

    // Get available products based on productIds
    const products = productIds.map(getProduct).filter(Boolean);

    const cartPath = `cart/${userId}.json`;
    const cart = (await readJSON(cartPath)) ?? [];

    const newCart = [...cart, ...products];
    await writeJSON(cartPath, newCart);

    if (!deleteWishlist) {
      return NextResponse.json<TData>(
        { data: { success: true } },
        { status: 200 }
      );
    }

    // Optionally remove products from wishlist
    const wishlistPath = `wishlist/${wishlistId}.json`;

    const wishlist: TWishlist = await readJSON(wishlistPath);
    const allAddedToCart = products.length === productIds.length;

    // If all products were added to cart, delete the(non-default) wishlist
    if (allAddedToCart && !wishlist.isDefault) {
      await deleteFile(wishlistPath);

      // Remove wishlist from user index
      const userWishlists: RoA<ID> = userIndex[userId] || [];
      const newUserWishlists = userWishlists.filter((id) => id !== wishlistId);
      const newUserIndex = {
        ...userIndex,
        [userId]: newUserWishlists,
      };

      await writeJSON("wishlist/user-index.json", newUserIndex);
    }

    console.log(products);
    // Otherwise, just remove products from the wishlist
    const updatedWishlist = {
      ...wishlist,
      products: wishlist.products.filter((p) => !products.includes(p.id)),
    };

    await writeJSON(wishlistPath, updatedWishlist);

    return NextResponse.json<TData>(
      { data: { success: true } },
      { status: 200 }
    );
  } catch {
    return NextResponse.json<TData>(
      { data: null, error: "Failed to add products to cart" },
      { status: 500 }
    );
  }
}

// * HELPERS

// Get product ID for cart, ensuring the product is in stock
const getProductForCart = (allProducts: TProducts) => (productId: ID) => {
  const product = allProducts[productId];

  if (!product || !product.isInStock) {
    return null;
  }

  return product.id;
};
