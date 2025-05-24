"use client";

import * as React from 'react';

import { addProductToWishlist } from '@/actions/addProductToWishlist';

import { ButtonIcon } from './ButtonIcon';
import { IconHeart } from './IconHeart';

type TAddParams = FirstParam<typeof addProductToWishlist>;

type TProps = NoChildren &
  TAddParams & {
    className?: ButtonClassName;
  };

export const AddToWishlistButton: React.FC<TProps> = ({
  className,
  productId,
  userId,
  wishlistId,
}) => {
  const addToWishlist = async () => {
    try {
      await addProductToWishlist({ userId, wishlistId, productId });
      // Optionally handle success
    } catch (error) {
      // Optionally handle error
      console.error(error);
    }
  };

  return (
    <ButtonIcon
      className={className}
      icon={<IconHeart />}
      onClick={addToWishlist}
      srText="Add to wishlist"
    />
  );
};
