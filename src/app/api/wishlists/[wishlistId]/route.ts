import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { TApiParams } from '@/types/params.types';
import { TProducts } from '@/types/products.types';
import {
  TWishlist,
  TWishlistForUI,
} from '@/types/wishlists.types';
import { checkUserAccess } from '@/utils/checkUserAccess';
import {
  deleteFile,
  readJSON,
  writeJSON,
} from '@/utils/fileUtils';

type TParams = TApiParams<{ wishlistId: ID }>;

type TData =
  | { data: TWishlistForUI; error?: never }
  | { data: null; error: string };

// Get a specific wishlist
export async function GET(request: NextRequest, { params }: TParams) {
  const { wishlistId } = await params;

  try {
    const userId = process.env.USER_ID ?? null;

    const wishlist: TWishlist = await readJSON(`wishlist/${wishlistId}.json`);

    if (!wishlist) {
      return NextResponse.json<TData>(
        { data: null, error: "Wishlist not found" },
        { status: 404 }
      );
    }

    // Check if the userId matches the wishlist owner
    const { isAuthorized } = await checkUserAccess({
      userId,
      wishlistId,
    });

    if (
      (!userId && !wishlist.isPublic) ||
      (userId && !wishlist.isPublic && !isAuthorized)
    ) {
      return NextResponse.json<TData>(
        { data: null, error: "This wishlist is private" },
        { status: 401 }
      );
    }

    const wishlistForUI = await getWishListForUI(wishlist);

    return NextResponse.json<TData>({ data: wishlistForUI }, { status: 200 });
  } catch {
    return NextResponse.json<TData>(
      { data: null, error: "Failed to load data" },
      { status: 500 }
    );
  }
}

// Update a specific wishlist for a user
export async function PATCH(request: NextRequest, { params }: TParams) {
  const { wishlistId } = await params;
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

    const wishlist = await readJSON(`wishlist/${wishlistId}.json`);

    if (!wishlist) {
      return NextResponse.json<TData>(
        { data: null, error: "Wishlist not found" },
        { status: 404 }
      );
    }

    const updatedWishlist = await updateWishlist(wishlist, request);
    await writeJSON(`wishlist/${wishlistId}.json`, updatedWishlist);

    const wishlistForUI = await getWishListForUI(updatedWishlist);

    return NextResponse.json<TData>({ data: wishlistForUI }, { status: 200 });
  } catch {
    return NextResponse.json<TData>(
      { data: null, error: "Failed to load data" },
      { status: 500 }
    );
  }
}

// Delete a specific wishlist for a user
export async function DELETE(request: NextRequest, { params }: TParams) {
  const { wishlistId } = await params;

  try {
    const userId = process.env.USER_ID ?? null;

    // Check if the userId matches the wishlist owner
    const { isAuthorized, userIndex } = await checkUserAccess({
      userId,
      wishlistId,
    });

    if (!isAuthorized || !userId) {
      return NextResponse.json<TData>(
        { data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const wishlist = await readJSON(`wishlist/${wishlistId}.json`);

    if (!wishlist) {
      return NextResponse.json<TData>(
        { data: null, error: "Wishlist not found" },
        { status: 404 }
      );
    }

    if (wishlist.isDefault) {
      return NextResponse.json<TData>(
        { data: null, error: "Cannot delete default wishlist" },
        { status: 400 }
      );
    }

    //Remove the wishlist file
    await deleteFile(`wishlist/${wishlistId}.json`);

    // Remove the wishlist from the user index
    const userWishlists: RoA<ID> = userIndex[userId] || [];
    const updatedUserWishlists = userWishlists.filter(
      (id) => id !== wishlistId
    );

    const newIndex = { ...userIndex, [userId]: updatedUserWishlists };
    await writeJSON("wishlist/user-index.json", newIndex);

    const wishlistForUI = await getWishListForUI(wishlist);

    return NextResponse.json<TData>({ data: wishlistForUI }, { status: 200 });
  } catch {
    return NextResponse.json<TData>(
      { data: null, error: "Failed to load data" },
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
