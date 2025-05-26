import * as React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { TProductForUI } from '@/types/products.types';

import { MoveToWishlistButton } from './MoveToWishlistButton';
import { RemoveFromWishlistButton } from './RemoveFromWishlistButton';
import { Card } from './ui/Card';

type TProps = NoChildren & {
  product: TProductForUI;
  wishlistId: ID;
  wishlists?: PropsOf<typeof MoveToWishlistButton>["wishlists"];
};

/**
 * Card component to display a product in a wishlist
 *
 * - Shows product image, name, price, and whether the price has increased
 * - Provides buttons to move the product to another wishlist or remove it from the current wishlist
 * - Includes a link to the product detail page
 */
export const ProductInWishlist: React.FC<TProps> = ({
  product,
  wishlists,
  wishlistId,
}) => {
  const isReadOnly = !wishlists;
  const isPriceHigher = product.price > product.priceAtAddition;

  return (
    <Card className="flex-row items-stretch">
      <Image src={product.image} alt={product.name} width={150} height={150} />

      <div className="p-4 flex flex-1 justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-base font-semibold tracking-tight">
            <Link href={`/product/${product.id}`}>
              <span className="absolute inset-0 z-10"></span>
              {product.name}
            </Link>
          </h2>

          <p className="text-sm">{product.price} CZK</p>

          {isPriceHigher && (
            <p className="text-sm text-red-700">Price increased!</p>
          )}
        </div>

        <div className="flex flex-col items-end justify-between">
          {!isReadOnly && (
            <div className="relative z-20 flex gap-2">
              <MoveToWishlistButton
                productId={product.id}
                wishlists={wishlists}
                wishlistId={wishlistId}
                userId="u1" // TODO: Replace with actual user ID
              />
              <RemoveFromWishlistButton
                productId={product.id}
                wishlistId={wishlistId}
                userId="u1" // TODO: Replace with actual user ID
              />
            </div>
          )}

          <Card.GoToDetail />
        </div>
      </div>
    </Card>
  );
};
