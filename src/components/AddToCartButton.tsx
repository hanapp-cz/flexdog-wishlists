"use client";
import * as React from 'react';

import { ShoppingBasket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Dialog } from 'radix-ui';
import { toast } from 'sonner';

import { addProductsToCart } from '@/actions/addProductsToCart';
import { TWishlistForUI } from '@/types/wishlists.types';
import { cn } from '@/utils/cn';
import { getErrorMessage } from '@/utils/getErrorMessage';

import { ButtonIcon } from './ui/ButtonIcon';
import {
  DialogCloseButton,
  DialogContent,
  DialogTitle,
} from './ui/Dialog';

type TProps = NoChildren & {
  wishlist: TWishlistForUI;
  className?: ButtonClassName;
};

export const AddToCartButton: React.FC<TProps> = ({ wishlist, className }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [shouldRemove, setShouldRemove] = React.useState(false);

  const toggleDialog = () => setIsOpen((prev) => !prev);

  const addToCart = async () => {
    try {
      const result = await addProductsToCart({
        wishlistId: wishlist.id,
        productIds: wishlist.products.map((p) => p.id),
        deleteWishlist: shouldRemove,
      });

      if (result.error || !result.data) {
        throw new Error(getErrorMessage(result.error));
      }

      toast.success("Products added to cart successfully!");

      if (shouldRemove) {
        // Redirect to all wishlists page after removing the wishlist
        router.replace("/wishlist");
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to add products to cart"));
    } finally {
      setIsOpen(false);
    }
  };

  const buttonStyles = cn(
    "bg-gray-200 hover:bg-gray-300",
    "text-gray-800 font-semibold",
    "py-2 px-4 rounded",
    "transition-colors duration-200",
    "cursor-pointer"
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={toggleDialog}>
      <Dialog.Trigger asChild>
        <ButtonIcon
          icon={<ShoppingBasket />}
          srText="Add all products to cart"
          className={cn("shadow-md", className)}
        />
      </Dialog.Trigger>

      <Dialog.Portal>
        <DialogContent>
          <DialogCloseButton />
          <DialogTitle>Do you want to keep this wishlist?</DialogTitle>

          <div className="flex items-center justify-center py-8">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={shouldRemove}
                onChange={(e) => setShouldRemove(e.target.checked)}
                className="size-4"
              />
              Delete wishlist after adding to cart
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <Dialog.Close asChild>
              <button className={buttonStyles}>Cancel</button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <button
                className={cn(
                  buttonStyles,
                  "bg-purple-600 text-white",
                  "hover:bg-purple-700 hover:text-white"
                )}
                onClick={addToCart}
              >
                Add products to cart
              </button>
            </Dialog.Close>
          </div>
        </DialogContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
