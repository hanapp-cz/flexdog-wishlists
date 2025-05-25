import * as React from 'react';

import { TWishListMetadata } from '@/types/wishlists.types';

import { DeleteWishlistButton } from './DeleteWishlistButton';
import { EditWishlistButton } from './EditWishlistButton';
import { Card } from './ui/Card';

type TProps = NoChildren & {
  wishlist: TWishListMetadata;
};

/**
 * Card component to display a wishlist with its name, description,
 * number of items, and options to edit or delete the wishlist
 *
 * - If the wishlist has items, the delete button opens a confirmation dialog
 */
export const WishlistCard: React.FC<TProps> = ({ wishlist }) => {
  return (
    <Card className="flex-row justify-between">
      <div className="p-4">
        <Card.Headline href={`/wishlist/${wishlist.id}`}>
          {wishlist.name}
        </Card.Headline>

        <p className="text-sm">{wishlist.description}</p>
        <p className="font-semibold">items: {wishlist.productsCount}</p>
        <Card.GoToDetail />
      </div>

      <div className="relative p-4 z-20 flex gap-4">
        <EditWishlistButton wishlist={wishlist} />
        <DeleteWishlistButton
          wishlistId={wishlist.id}
          hasItems={wishlist.productsCount > 0}
        />
      </div>
    </Card>
  );
};
