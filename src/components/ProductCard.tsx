import * as React from 'react';

import Image from 'next/image';

import { TProduct } from '@/types/products.types';
import { cn } from '@/utils/cn';

import { AddToWishlistButton } from './AddToWishlistButton';
import { Card } from './ui/Card';

type TProps = NoChildren & {
  product: TProduct;
};

export const ProductCard: React.FC<TProps> = ({ product }) => {
  return (
    <Card>
      <div className="relative aspect-square w-full">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain object-top"
        />
      </div>

      <div className="p-4">
        <Card.Headline href={`/product/${product.id}`}>
          {product.name}
        </Card.Headline>

        <p className="text-sm">{product.price} CZK</p>
        <Card.GoToDetail />
      </div>

      <AddToWishlistButton
        className="absolute top-2 right-2 z-20"
        productId={product.id}
        wishlistId="w1" // TODO: Replace with actual wishlist ID
        userId="u1" // TODO: Replace with actual user ID
      />
    </Card>
  );
};
