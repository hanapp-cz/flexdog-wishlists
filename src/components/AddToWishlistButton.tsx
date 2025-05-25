"use client";

import * as React from 'react';

import { Heart } from 'lucide-react';
import { Dialog } from 'radix-ui';
import { toast } from 'sonner';

import { addProductToWishlist } from '@/actions/addProductToWishlist';
import { TWishListMetadata } from '@/types/wishlists.types';
import { cn } from '@/utils/cn';
import { getErrorMessage } from '@/utils/getErrorMessage';

import { AddWishlistButton } from './AddWishlistButton';
import { ButtonIcon } from './ui/ButtonIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/Dropdown';
import { WishlistDialog } from './WishlistDialog';

type TAddParams = Pick<
  FirstParam<typeof addProductToWishlist>,
  "productId" | "userId"
>;

type TProps = NoChildren &
  TAddParams & {
    className?: ButtonClassName;
  } & {
    wishlists: RoA<TWishListMetadata>;
  };

export const AddToWishlistButton: React.FC<TProps> = ({
  className,
  productId,
  userId,
  wishlists,
}) => {
  const addToWishlist = async (wishlistId: ID) => {
    try {
      const result = await addProductToWishlist({
        userId,
        wishlistId,
        productId,
      });

      if (result.error || !result.data) {
        throw new Error(getErrorMessage(result.error));
      }

      toast.success("Product added to wishlist");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to add product to wishlist"));
    }
  };

  return (
    <WishlistDialog type="add">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ButtonIcon
            className={cn("relative", className)}
            icon={<Heart />}
            srText="Add to wishlist"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-fit">
          <DropdownMenuLabel>Select Wishlist</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {wishlists.map((wishlist) => (
            <DropdownMenuItem
              key={wishlist.id}
              onClick={() => addToWishlist(wishlist.id)}
              className="cursor-pointer"
            >
              {wishlist.name}
            </DropdownMenuItem>
          ))}
          <Dialog.Trigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <AddWishlistButton />
            </DropdownMenuItem>
          </Dialog.Trigger>
        </DropdownMenuContent>
      </DropdownMenu>
    </WishlistDialog>
  );
};
