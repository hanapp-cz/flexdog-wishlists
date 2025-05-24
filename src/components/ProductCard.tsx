import * as React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { TProduct } from '@/types/products.types';
import { cn } from '@/utils/cn';

import { AddToWishlistButton } from './AddToWishlistButton';

type TProps = NoChildren & {
  product: TProduct;
};

export const ProductCard: React.FC<TProps> = ({ product }) => {
  return (
    <article
      className={cn(
        "relative isolate",
        "flex flex-col items-start",
        "rounded-2xl overflow-hidden",
        "bg-zinc-50 hover:bg-zinc-100 transition-colors"
      )}
    >
      <div className="aspect-square w-full">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain object-top w-full h-full"
        />
      </div>

      <div className="p-4">
        <h2 className="text-base font-semibold tracking-tight">
          <Link href={`/product/${product.id}`}>
            <span className="absolute inset-0 z-10"></span>
            {product.name}
          </Link>
        </h2>

        <p className="text-sm">{product.price} CZK</p>
        <div
          aria-hidden="true"
          className="flex items-center text-sm font-medium text-purple-600"
        >
          Go to detail &rarr;
        </div>
      </div>

      <AddToWishlistButton
        className="absolute top-2 right-2 z-20"
        productId={product.id}
        wishlistId="w1" // TODO: Replace with actual wishlist ID
        userId="u1" // TODO: Replace with actual user ID
      />
    </article>
  );
};
