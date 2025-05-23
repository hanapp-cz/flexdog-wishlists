import { NextResponse } from 'next/server';

import { TProduct } from '@/types/products.types';
import { readJSON } from '@/utils/fileUtils';

type TData =
  | { data: RoA<TProduct>; error?: never }
  | { data: null; error: string };

export async function GET() {
  try {
    const products = await readJSON("products.json");

    return NextResponse.json<TData>({ data: products }, { status: 200 });
  } catch {
    return NextResponse.json<TData>(
      { data: null, error: "failed to load data" },
      { status: 500 }
    );
  }
}
