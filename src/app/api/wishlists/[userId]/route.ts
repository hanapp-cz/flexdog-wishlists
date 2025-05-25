import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { TApiParams } from '@/types/params.types';
import {
  TWishlist,
  TWishListMetadata,
  TWishlists,
} from '@/types/wishlists.types';
import {
  readJSON,
  writeJSON,
} from '@/utils/fileUtils';

type TParams = TApiParams<{ userId: ID }>;

type TData =
  | { data: RoA<TWishListMetadata> | TWishListMetadata; error?: never }
  | { data: null; error: string };

// get all wishlists for a user
export async function GET(request: NextRequest, { params }: TParams) {
  const { userId } = await params;

  try {
    const wishlists: TWishlists = await readJSON(`wishlist/${userId}.json`);

    if (!wishlists) {
      return NextResponse.json<TData>(
        { data: null, error: "wishlists not found" },
        { status: 404 }
      );
    }

    const wishListsForUI = Object.values(wishlists).map(getWishListForUI);

    return NextResponse.json<TData>({ data: wishListsForUI }, { status: 200 });
  } catch {
    return NextResponse.json<TData>(
      { data: null, error: "failed to load data" },
      { status: 500 }
    );
  }
}

// create a new wishlist for a user
export async function POST(request: NextRequest, { params }: TParams) {
  const { userId } = await params;

  try {
    const requestData: Partial<TWishlist> = await request.json();

    if (!requestData.name) {
      return NextResponse.json<TData>(
        { data: null, error: "missing name" },
        { status: 400 }
      );
    }

    const wishlists = await readJSON(`wishlist/${userId}.json`);
    const newWishlist: TWishlist = {
      id: crypto.randomUUID(),
      name: requestData.name,
      description: requestData.description ?? "",
      products: requestData.products ?? [],
      isPublic: false,
    };

    if (!wishlists) {
      // Create new file with new wishlist
      const newWishlists = { [newWishlist.id]: newWishlist };
      await writeJSON(`wishlist/${userId}.json`, newWishlists);
    }

    const updatedWishlists = { ...wishlists, [newWishlist.id]: newWishlist };

    await writeJSON(`wishlist/${userId}.json`, updatedWishlists);

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

const getWishListForUI = (wishlist: TWishlist) => {
  const { products, ...metaData } = wishlist;

  return {
    ...metaData,
    productsCount: products.length,
  };
};
