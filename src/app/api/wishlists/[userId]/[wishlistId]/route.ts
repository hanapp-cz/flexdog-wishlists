import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { TApiParams } from '@/types/params.types';
import { TProducts } from '@/types/products.types';
import {
  TWishlist,
  TWishlistForUI,
  TWishlists,
} from '@/types/wishlists.types';
import {
  readJSON,
  writeJSON,
} from '@/utils/fileUtils';

type TParams = TApiParams<{ userId: ID; wishlistId: ID }>;

type TData =
  | { data: TWishlistForUI; error?: never }
  | { data: null; error: string };

// Get a specific wishlist for a user
export async function GET(request: NextRequest, { params }: TParams) {
  const { userId, wishlistId } = await params;

  try {
    const wishlists: TWishlists = await readJSON(`wishlist/${userId}.json`);

    if (!wishlists) {
      return NextResponse.json<TData>(
        { data: null, error: "wishlists not found" },
        { status: 404 }
      );
    }

    const wishlist = wishlists[wishlistId];

    if (!wishlist) {
      return NextResponse.json<TData>(
        { data: null, error: "wishlist not found" },
        { status: 404 }
      );
    }

    const wishlistForUI = await getWishListForUI(wishlist);

    return NextResponse.json<TData>({ data: wishlistForUI }, { status: 200 });
  } catch {
    return NextResponse.json<TData>(
      { data: null, error: "failed to load data" },
      { status: 500 }
    );
  }
}

// Update a specific wishlist for a user
export async function PATCH(request: NextRequest, { params }: TParams) {
  const { userId, wishlistId } = await params;
  try {
    const wishlists = await readJSON(`wishlist/${userId}.json`);

    if (!wishlists) {
      return NextResponse.json<TData>(
        { data: null, error: "wishlists not found" },
        { status: 404 }
      );
    }

    const wishlist = wishlists[wishlistId];

    if (!wishlist) {
      return NextResponse.json<TData>(
        { data: null, error: "wishlist not found" },
        { status: 404 }
      );
    }

    const updatedWishlist = await updateWishlist(wishlist, request);
    const newWishlists = { ...wishlists, [wishlistId]: updatedWishlist };
    await writeJSON(`wishlist/${userId}.json`, newWishlists);

    const wishlistForUI = await getWishListForUI(updatedWishlist);

    return NextResponse.json<TData>({ data: wishlistForUI }, { status: 200 });
  } catch {
    return NextResponse.json<TData>(
      { data: null, error: "failed to load data" },
      { status: 500 }
    );
  }
}

// Delete a specific wishlist for a user
export async function DELETE(request: NextRequest, { params }: TParams) {
  const { userId, wishlistId } = await params;

  try {
    const wishlists = await readJSON(`wishlist/${userId}.json`);

    if (!wishlists) {
      return NextResponse.json<TData>(
        { data: null, error: "wishlists not found" },
        { status: 404 }
      );
    }

    const { [wishlistId]: deletedWishlist, ...rest } = wishlists;

    await writeJSON(`wishlist/${userId}.json`, rest);

    const wishlistForUI = await getWishListForUI(deletedWishlist);

    return NextResponse.json<TData>({ data: wishlistForUI }, { status: 200 });
  } catch {
    return NextResponse.json<TData>(
      { data: null, error: "failed to load data" },
      { status: 500 }
    );
  }
}

// * HELPERS

const updateWishlist = async (wishlist: TWishlist, request: NextRequest) => {
  const { name, description, isPublic } = await request.json();

  const updatedWishlist = {
    ...wishlist,
    ...(name !== undefined && { name }),
    ...(description !== undefined && { description }),
    ...(isPublic !== undefined && { isPublic }),
  };

  return updatedWishlist;
};

const getWishListForUI = async (wishlist: TWishlist) => {
  const allProducts: TProducts = await readJSON("products.json");

  // Map wishlist products to full product data
  const products = wishlist.products.map((product) => {
    const productData = allProducts[product.id];

    return { ...productData, priceAtAddition: product.price };
  });

  return {
    ...wishlist,
    products,
  };
};
