"use client";

import * as React from 'react';

import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { removeProductFromWishlist } from '@/actions/removeProductFromWishlist';
import { getErrorMessage } from '@/utils/getErrorMessage';

import { ButtonIcon } from './ui/ButtonIcon';

type TRemoveParams = FirstParam<typeof removeProductFromWishlist>;

type TProps = NoChildren &
  TRemoveParams & {
    className?: ButtonClassName;
  };

export const RemoveFromWishlistButton: React.FC<TProps> = ({
  className,
  productId,
  wishlistId,
}) => {
  const removeFromWishlist = async () => {
    try {
      const result = await removeProductFromWishlist({
        wishlistId,
        productId,
      });

      if (result.error || !result.data) {
        throw new Error(getErrorMessage(result.error));
      }

      toast.success("Product was removed from wishlist");
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Failed to remove product from wishlist")
      );
    }
  };

  return (
    <ButtonIcon
      className={className}
      icon={<Trash2 />}
      onClick={removeFromWishlist}
      srText="Remove from wishlist"
    />
  );
};
