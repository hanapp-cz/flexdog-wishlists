"use client";

import * as React from 'react';

import { ArrowLeftRight } from 'lucide-react';
import { toast } from 'sonner';

import { addProductToWishlist } from '@/actions/addProductToWishlist';
import {
  moveProductBetweenWishlists,
} from '@/actions/moveProductBetweenWishlists';
import { TWishListMetadata } from '@/types/wishlists.types';
import { cn } from '@/utils/cn';
import { getErrorMessage } from '@/utils/getErrorMessage';

import { ButtonIcon } from './ui/ButtonIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/Dropdown';

type TAddParams = Pick<FirstParam<typeof addProductToWishlist>, "productId">;

type TProps = NoChildren &
  TAddParams & {
    className?: ButtonClassName;
  } & {
    wishlistId: ID;
    wishlists: RoA<TWishListMetadata>;
  };

/**
 * Button to move a product to another wishlist
 *
 * - Opens a dropdown to select another wishlist
 * - Moves the product to the selected wishlist
 */
export const MoveToWishlistButton: React.FC<TProps> = ({
  className,
  productId,
  wishlists,
  wishlistId,
}) => {
  const moveProduct = async (toWishlistId: ID) => {
    try {
      const { data, error } = await moveProductBetweenWishlists({
        productId,
        wishlistId,
        toWishlistId,
      });

      if (error || !data) {
        throw new Error(getErrorMessage(error));
      }

      toast.success("Product moved successfully");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to move product"));
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ButtonIcon
          className={cn("relative", className)}
          icon={<ArrowLeftRight />}
          srText="Move to another wishlist"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-fit">
        <DropdownMenuLabel>Move to wishlist</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {wishlists
          .filter((wishlist) => wishlist.id !== wishlistId) // Exclude current wishlist
          .map((wishlist) => (
            <DropdownMenuItem
              key={wishlist.id}
              onClick={() => moveProduct(wishlist.id)}
              className="cursor-pointer"
            >
              {wishlist.name}
            </DropdownMenuItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
