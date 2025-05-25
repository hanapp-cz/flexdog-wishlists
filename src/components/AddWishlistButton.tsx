import * as React from 'react';

import { PlusCircle } from 'lucide-react';

import { cn } from '@/utils/cn';

type TProps = NoChildren;

export const AddWishlistButton: React.FC<TProps> = () => {
  return (
    <button
      className={cn(
        "flex items-center gap-2 w-fit",
        "px-4 py-2",
        "border-2 border-purple-600 rounded-lg",
        "cursor-pointer hover:bg-purple-50 transition-colors"
      )}
    >
      <PlusCircle className="text-purple-600" />
      New Wishlist
    </button>
  );
};
