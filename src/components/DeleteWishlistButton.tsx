"use client";
import * as React from 'react';

import { Trash2 } from 'lucide-react';
import { Dialog } from 'radix-ui';
import { toast } from 'sonner';

import {
  deleteWishlist as deleteWishlistAction,
} from '@/actions/deleteWishlist';
import { cn } from '@/utils/cn';
import { getErrorMessage } from '@/utils/getErrorMessage';

import { ButtonIcon } from './ui/ButtonIcon';
import {
  DialogCloseButton,
  DialogContent,
  DialogTitle,
} from './ui/Dialog';

type TProps = NoChildren & {
  hasItems: boolean;
  wishlistId: ID;
  className?: ButtonClassName;
};

/**
 * Button to delete a wishlist
 *
 *  - If the wishlist has items, we show a confirmation modal before deleting
 *  - If it doesn't, we can delete it directly
 */
export const DeleteWishlistButton: React.FC<TProps> = ({
  hasItems,
  className,
  wishlistId,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleDialog = () => setIsOpen((prev) => !prev);
  const openDialog = () => setIsOpen(true);

  const deleteWishlist = async () => {
    try {
      const result = await deleteWishlistAction({ userId: "u1", wishlistId });

      if (result.error || !result.data) {
        throw new Error(getErrorMessage(result.error));
      }

      toast.success("Wishlist was deleted");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete wishlist"));
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
      <ButtonIcon
        icon={<Trash2 />}
        srText="Delete wishlist"
        onClick={hasItems ? openDialog : deleteWishlist}
        className={cn("shadow-md", className)}
      />

      <Dialog.Portal>
        <DialogContent>
          <DialogCloseButton />
          <DialogTitle>Delete Wishlist</DialogTitle>

          <Dialog.Description className="pt-4">
            This wishlist has items. Are you sure you want to delete it? This
            action cannot be undone.
          </Dialog.Description>

          <div className="flex justify-end gap-2 mt-4">
            <Dialog.Close asChild>
              <button className={buttonStyles} onClick={deleteWishlist}>
                Delete
              </button>
            </Dialog.Close>
            <Dialog.Close asChild>
              <button className={buttonStyles}>Keep Wishlist</button>
            </Dialog.Close>
          </div>
        </DialogContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
