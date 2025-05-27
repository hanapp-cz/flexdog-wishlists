import {
  NextRequest,
  NextResponse,
} from 'next/server';

import {
  TWishlist,
  TWishListMetadata,
} from '@/types/wishlists.types';
import {
  readJSON,
  writeJSON,
} from '@/utils/fileUtils';

type TData =
  | { data: RoA<TWishListMetadata> | TWishListMetadata; error?: never }
  | { data: null; error: string };

const DEFAULT_WISHLIST_NAME = "My Wishlist";

// get all wishlists for a user
export async function GET() {
  try {
    const userId = process.env.USER_ID ?? null;

    if (!userId) {
      return NextResponse.json<TData>(
        { data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Load the user-to-wishlist index
    const userIndex = await readJSON("wishlist/user-index.json");
    const wishlistIds: RoA<ID> = userIndex[userId] || [];

    // If no wishlists exist for the user, create a default wishlist
    if (wishlistIds.length === 0) {
      const defaultWishlist = {
        id: crypto.randomUUID(),
        name: DEFAULT_WISHLIST_NAME,
        description: "",
        isPublic: false,
        isDefault: true,
        products: [],
      };
      await writeJSON(`wishlist/${defaultWishlist.id}.json`, defaultWishlist);

      // Update user-index
      userIndex[userId] = [defaultWishlist.id];
      await writeJSON("wishlist/user-index.json", userIndex);

      const defaultWishlistForUI = getWishListForUI(defaultWishlist);
      return NextResponse.json<TData>(
        { data: [defaultWishlistForUI] },
        { status: 200 }
      );
    }

    // Load each wishlist file
    const wishlists: RoA<TWishlist> = await Promise.all(
      wishlistIds.map(async (id) => {
        try {
          return await readJSON(`wishlist/${id}.json`);
        } catch {
          return null;
        }
      })
    );

    const wishListsForUI = wishlists.filter(Boolean).map(getWishListForUI);

    return NextResponse.json<TData>({ data: wishListsForUI }, { status: 200 });
  } catch {
    return NextResponse.json<TData>(
      { data: null, error: "failed to load data" },
      { status: 500 }
    );
  }
}

// create a new wishlist for a user
export async function POST(request: NextRequest) {
  try {
    const userId = process.env.USER_ID ?? null;

    if (!userId) {
      return NextResponse.json<TData>(
        { data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const requestData: Partial<TWishlist> = await request.json();

    if (!requestData.name) {
      return NextResponse.json<TData>(
        { data: null, error: "missing name" },
        { status: 400 }
      );
    }

    const newWishlist: TWishlist = {
      id: crypto.randomUUID(),
      name: requestData.name,
      description: requestData.description ?? "",
      products: requestData.products ?? [],
      isPublic: false,
      isDefault: false,
    };

    // Create new file with new wishlist
    await writeJSON(`wishlist/${newWishlist.id}.json`, newWishlist);

    // Update user index
    const userIndex = await readJSON("wishlist/user-index.json");
    const userWishlists = userIndex[userId] || [];
    const newUserWishlists = [...userWishlists, newWishlist.id];

    const newUserIndex = {
      ...userIndex,
      [userId]: newUserWishlists,
    };

    await writeJSON("wishlist/user-index.json", newUserIndex);

    return NextResponse.json<TData>(
      { data: getWishListForUI(newWishlist) },
      { status: 201 }
    );
  } catch {
    return NextResponse.json<TData>(
      { data: null, error: "failed to load data" },
      { status: 500 }
    );
  }
}

// * HELPERS

const getWishListForUI = (wishlist: TWishlist): TWishListMetadata => {
  const { products, ...metaData } = wishlist;

  return {
    ...metaData,
    productsCount: products.length,
  };
};
