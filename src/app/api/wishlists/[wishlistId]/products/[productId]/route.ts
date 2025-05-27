import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { TApiParams } from '@/types/params.types';
import { TProducts } from '@/types/products.types';
import {
  TWishlist,
  TWishlistProduct,
} from '@/types/wishlists.types';
import { checkUserAccess } from '@/utils/checkUserAccess';
import {
  readJSON,
  writeJSON,
} from '@/utils/fileUtils';

type TParams = TApiParams<{ wishlistId: ID; productId: ID }>;

type TData = { data: TWishlist; error?: never } | { data: null; error: string };

// Add a product to a user's wishlist
export async function POST(request: NextRequest, { params }: TParams) {
  const { wishlistId, productId } = await params;

  const filePath = `wishlist/${wishlistId}.json`;
  const productsFilePath = `products.json`;

  try {
    const userId = process.env.USER_ID ?? null;

    // Check if the userId matches the wishlist owner
    const { isAuthorized } = await checkUserAccess({
      userId,
      wishlistId,
    });

    if (!isAuthorized) {
      return NextResponse.json<TData>(
        { data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const productsPromise = readJSON(productsFilePath);
    const wishlistPromise = readJSON(filePath);
    const [availableProducts, wishlist]: [TProducts, TWishlist] =
      await Promise.all([productsPromise, wishlistPromise]);

    if (!wishlist) {
      return NextResponse.json<TData>(
        { data: null, error: "Wishlist not found" },
        { status: 404 }
      );
    }
    const product = availableProducts[productId];

    if (!product) {
      return NextResponse.json<TData>(
        { data: null, error: "Product not found" },
        { status: 400 }
      );
    }
    const isInList = wishlist.products.some((p) => p.id === product.id);

    if (isInList) {
      return NextResponse.json<TData>(
        { data: null, error: "Product already in wishlist" },
        { status: 409 }
      );
    }

    const newProduct: TWishlistProduct = {
      id: product.id,
      price: product.price,
    };

    const updatedWishlist: TWishlist = {
      ...wishlist,
      products: [...wishlist.products, newProduct],
    };

    await writeJSON(filePath, updatedWishlist);

    return NextResponse.json<TData>({ data: updatedWishlist }, { status: 200 });
  } catch {
    return NextResponse.json<TData>(
      { data: null, error: "Failed to add product to wishlist" },
      { status: 500 }
    );
  }
}

// Remove a product from a user's wishlist
export async function DELETE(request: NextRequest, { params }: TParams) {
  const { wishlistId, productId } = await params;
  const filePath = `wishlist/${wishlistId}.json`;

  try {
    const userId = process.env.USER_ID ?? null;

    // Check if the userId matches the wishlist owner
    const { isAuthorized } = await checkUserAccess({
      userId,
      wishlistId,
    });

    if (!isAuthorized) {
      return NextResponse.json<TData>(
        { data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const wishlist: TWishlist = await readJSON(filePath);

    if (!wishlist) {
      return NextResponse.json<TData>(
        { data: null, error: "Wishlist not found" },
        { status: 404 }
      );
    }

    const updatedWishlist: TWishlist = {
      ...wishlist,
      products: wishlist.products.filter((p) => p.id !== productId),
    };

    await writeJSON(filePath, updatedWishlist);

    return NextResponse.json<TData>({ data: updatedWishlist }, { status: 200 });
  } catch {
    return NextResponse.json<TData>(
      { data: null, error: "Failed to remove product from wishlist" },
      { status: 500 }
    );
  }
}
