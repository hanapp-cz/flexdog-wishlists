import * as React from 'react';

import { TWishlistForUI } from '@/types/wishlists.types';

import { AddToCartButton } from './AddToCartButton';
import { EditWishlistButton } from './EditWishlistButton';
import { ProductInWishlist } from './ProductInWishlist';
import { ShareButton } from './ShareButton';

type TProps = NoChildren & {
  wishlist: TWishlistForUI;
  allWishlists?: PropsOf<typeof ProductInWishlist>["wishlists"];
};

export const Wishlist: React.FC<TProps> = ({ wishlist, allWishlists }) => {
  const isReadOnly = !allWishlists;

  return (
    <>
      <div className="flex flex-wrap gap-4 items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{wishlist.name}</h1>
          <p>{wishlist.description}</p>
        </div>

        {!isReadOnly && (
          <div className="flex items-center gap-4">
            <AddToCartButton
              className="shadow-none border-2 border-gray-300 hover:border-purple-600 transition-colors"
              wishlist={wishlist}
            />
            <EditWishlistButton
              wishlist={wishlist}
              className="shadow-none border-2 border-gray-300 hover:border-purple-600 transition-colors"
            />
            <ShareButton
              wishlistId={wishlist.id}
              isPublic={wishlist.isPublic}
            />
          </div>
        )}
      </div>

      <ul className="flex flex-col gap-4">
        {wishlist.products.map((product) => (
          <li key={product.id}>
            <ProductInWishlist
              product={product}
              wishlistId={wishlist.id}
              wishlists={allWishlists}
            />
          </li>
        ))}
      </ul>
    </>
  );
};
