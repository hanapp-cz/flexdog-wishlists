import * as React from 'react';

import { X } from 'lucide-react';
import { Dialog } from 'radix-ui';

import { cn } from '@/utils/cn';

export const DialogCloseButton: React.FC<NoChildren> = () => {
  return (
    <Dialog.Close asChild>
      <button className="absolute top-4 right-4 cursor-pointer">
        {/* touch zone for touch devices only */}
        <span className="size-12 absolute left-1/2 top-1/2 -translate-1/2 [@media(pointer:fine)]:hidden" />
        <X />
      </button>
    </Dialog.Close>
  );
};

export const DialogContent: React.FC<RequiredChildren> = ({ children }) => {
  return (
    <>
      <div className="fixed isolate inset-0 bg-black/50 z-100" />
      <Dialog.Content
        className={cn(
          "absolute top-1/2 left-1/2 z-150",
          "transform -translate-x-1/2 -translate-y-1/2",
          "w-full max-w-md p-6",
          "bg-white rounded-lg shadow-lg"
        )}
      >
        {children}
      </Dialog.Content>
    </>
  );
};

export const DialogTitle: React.FC<RequiredChildren> = ({ children }) => {
  return (
    <Dialog.Title
      className={cn(
        "font-medium text-lg text-center",
        "border-b border-b-purple-600",
        "-mx-6 px-6 pb-4"
      )}
    >
      {children}
    </Dialog.Title>
  );
};
