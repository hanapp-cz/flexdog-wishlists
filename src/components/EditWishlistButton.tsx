"use client";
import * as React from "react";

import { Edit } from "lucide-react";
import { Dialog } from "radix-ui";

import { TWishListMetadata } from "@/types/wishlists.types";
import { cn } from "@/utils/cn";

import { ButtonIcon } from "./ui/ButtonIcon";
import { WishlistDialog } from "./WishlistDialog";

type TProps = NoChildren & {
  wishlist: OmitSafe<TWishListMetadata, "productsCount">;
  className?: ButtonClassName;
};

/**
 * Button to edit a wishlist
 *
 * - Opens the WishlistDialog to edit the wishlist details
 */
export const EditWishlistButton: React.FC<TProps> = ({
  className,
  wishlist,
}) => {
  return (
    <WishlistDialog
      type="edit"
      wishlistId={wishlist.id}
      name={wishlist.name}
      description={wishlist.description ?? ""}
    >
      <Dialog.Trigger asChild>
        <ButtonIcon
          icon={<Edit />}
          srText="Edit wishlist"
          className={cn("shadow-md", className)}
        />
      </Dialog.Trigger>
    </WishlistDialog>
  );
};
