import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { TProducts } from '@/types/products.types';
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

  const { isAuthorized } = await checkUserAccess({ userId, wishlistId });

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

  // 2. Optionally remove products from wishlist
  if (deleteWishlist) {
    const wishlistPath = `wishlist/${wishlistId}.json`;
    await deleteFile(wishlistPath);
  }

  return NextResponse.json<TData>({ data: { success: true } }, { status: 200 });
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
