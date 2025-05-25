import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { TApiParams } from '@/types/params.types';
import { TProducts } from '@/types/products.types';
import {
  TWishlist,
  TWishlistProduct,
  TWishlists,
} from '@/types/wishlists.types';
import {
  readJSON,
  writeJSON,
} from '@/utils/fileUtils';

type TParams = TApiParams<{ userId: ID; wishlistId: ID; productId: ID }>;

type TData = { data: TWishlist; error?: never } | { data: null; error: string };

// Add a product to a user's wishlist
export async function POST(request: NextRequest, { params }: TParams) {
  const { userId, wishlistId, productId } = await params;

  const filePath = `wishlist/${userId}.json`;
  const productsFilePath = `products.json`;

  try {
    const availableProducts: TProducts = await readJSON(productsFilePath);
    const wishlists: TWishlists = await readJSON(filePath);
    const wishlist = wishlists[wishlistId];

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

    const newWishlists = { ...wishlists, [wishlistId]: updatedWishlist };
    await writeJSON(filePath, newWishlists);

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
  const { userId, wishlistId, productId } = await params;
  const filePath = `wishlist/${userId}.json`;

  try {
    const wishlists: TWishlists = await readJSON(filePath);
    const wishlist = wishlists[wishlistId];
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

    const newWishlists = { ...wishlists, [wishlistId]: updatedWishlist };
    await writeJSON(filePath, newWishlists);

    return NextResponse.json<TData>({ data: updatedWishlist }, { status: 200 });
  } catch {
    return NextResponse.json<TData>(
      { data: null, error: "Failed to remove product from wishlist" },
      { status: 500 }
    );
  }
}
