import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { TApiParams } from '@/types/params.types';
import {
  TWishlist,
  TWishlistProduct,
} from '@/types/wishlists.types';
import { checkUserAccess } from '@/utils/checkUserAccess';
import {
  readJSON,
  writeJSON,
} from '@/utils/fileUtils';

type TParams = TApiParams<{ userId: ID; wishlistId: ID; productId: ID }>;

type TData =
  | { data: null; error?: string }
  | { data: TWishlistProduct; error?: never };

// Move a product from one wishlist to another
export async function POST(request: NextRequest, { params }: TParams) {
  const { wishlistId, productId } = await params;

  try {
    const userId = process.env.USER_ID ?? null;

    // Check if the userId matches the wishlist owner
    const { isAuthorized } = await checkUserAccess({
      userId,
      wishlistId,
    });

    if (!isAuthorized) {
      return NextResponse.json<TData>(
        { data: null, error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { toWishlistId } = await request.json();

    if (!wishlistId || !toWishlistId || !productId) {
      return NextResponse.json<TData>(
        { data: null, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const fromWishlistPromise = readJSON(`wishlist/${wishlistId}.json`);
    const toWishlistPromise = readJSON(`wishlist/${toWishlistId}.json`);
    const [fromWishlist, toWishlist]: RoA<TWishlist> = await Promise.all([
      fromWishlistPromise,
      toWishlistPromise,
    ]);

    if (!fromWishlist || !toWishlist) {
      return NextResponse.json<TData>(
        { data: null, error: "One or both wishlists not found" },
        { status: 404 }
      );
    }

    const product = fromWishlist.products.find((p) => p.id === productId);

    if (!product) {
      return NextResponse.json<TData>(
        { data: null, error: "Product not found in source wishlist" },
        { status: 404 }
      );
    }

    const isInDestination = toWishlist.products.some((p) => p.id === productId);

    if (isInDestination) {
      return NextResponse.json<TData>(
        { data: null, error: "Product already exists in destination wishlist" },
        { status: 400 }
      );
    }

    const updatedFromWishlist: TWishlist = {
      ...fromWishlist,
      products: fromWishlist.products.filter((p) => p.id !== productId),
    };

    const updatedToWishlist: TWishlist = {
      ...toWishlist,
      products: [...toWishlist.products, product],
    };

    const fromPromise = writeJSON(
      `wishlist/${updatedFromWishlist.id}.json`,
      updatedFromWishlist
    );
    const toPromise = writeJSON(
      `wishlist/${updatedToWishlist.id}.json`,
      updatedToWishlist
    );

    await Promise.all([fromPromise, toPromise]);

    return NextResponse.json<TData>({ data: product }, { status: 200 });
  } catch {
    return NextResponse.json<TData>(
      { data: null, error: "Failed to move product" },
      { status: 500 }
    );
  }
}
