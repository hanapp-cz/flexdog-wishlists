import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { TApiParams } from '@/types/params.types';
import {
  TProduct,
  TProducts,
} from '@/types/products.types';
import { readJSON } from '@/utils/fileUtils';

type TParams = TApiParams<{ productId: ID }>;

type TData = { data: TProduct; error?: never } | { data: null; error: string };

export async function GET(request: NextRequest, { params }: TParams) {
  const { productId } = await params;

  try {
    const products: TProducts = await readJSON("products.json");

    const product = products[productId];

    if (!product) {
      return NextResponse.json<TData>(
        { data: null, error: "product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<TData>({ data: product }, { status: 200 });
  } catch {
    return NextResponse.json<TData>(
      { data: null, error: "failed to load data" },
      { status: 500 }
    );
  }
}
