import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { TProduct } from '@/types/products.types';
import { readJSON } from '@/utils/fileUtils';

type TParams = {
  params: Promise<{ productId: ID }>;
};

type TData = { data: TProduct; error?: never } | { data: null; error: string };

export async function GET(request: NextRequest, { params }: TParams) {
  const { productId } = await params;

  try {
    const products: RoA<TProduct> = await readJSON("products.json");

    const product = products.find((product) => product.id === productId);

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
