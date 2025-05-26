"use client";

import * as React from "react";

import { toast } from "sonner";

import { editWishlist } from "@/actions/editWishlist";
import { cn } from "@/utils/cn";

type TProps = NoChildren & {
  wishlistId: ID;
  isPublic: boolean; // Optional prop to indicate if the wishlist is public
};

export const ShareButton: React.FC<TProps> = ({ wishlistId, isPublic }) => {
  const [copied, setCopied] = React.useState(false);

  const publicUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/public/wishlist/${wishlistId}`;

  const copyLink = async () => {
    try {
      const clipboardPromise = navigator.clipboard.writeText(publicUrl);
      const editWishlistPromise = editWishlist({
        wishlistData: { isPublic: true },
        wishlistId,
        userId: "u1", // TODO: Replace with actual user ID
      });

      await Promise.all([
        clipboardPromise,
        isPublic ? undefined : editWishlistPromise, // Make the wishlist public only if it is not already
      ]);
    } catch {
      toast.error("Failed to copy link, please try again.");
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copyLink}
      className={cn(
        "flex items-center justify-center gap-2",
        "w-fit min-w-36",
        "px-4 py-2",
        "border-2 border-gray-300 hover:border-purple-600 rounded-lg",
        "cursor-pointer transition-colors"
      )}
    >
      {copied ? "Link copied!" : "Share Wishlist"}
    </button>
  );
};
