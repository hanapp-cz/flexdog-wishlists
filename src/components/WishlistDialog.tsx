"use client";

import * as React from 'react';

import {
  Dialog,
  Form,
} from 'radix-ui';
import { toast } from 'sonner';

import { addWishlist } from '@/actions/addWishlist';
import { editWishlist } from '@/actions/editWishlist';
import { getErrorMessage } from '@/utils/getErrorMessage';

import {
  DialogCloseButton,
  DialogContent,
  DialogTitle,
} from './ui/Dialog';
import {
  FieldError,
  FormField,
  FormSubmitButton,
} from './ui/form';

type TTypeProps =
  | {
      type: "add";
      wishlistId?: never;
      name?: never;
      description?: never;
    }
  | {
      type: "edit";
      wishlistId: ID;
      name: string;
      description: string;
    };

type TProps = RequiredChildren & TTypeProps;

/**
 * Dialog component to add or edit a wishlist
 *
 * It is used both for creating a new wishlist and editing an existing one
 *
 * Based on the `type` prop:
 * - If `type` is "add", it allows creating a new wishlist
 * - If `type` is "edit", it allows editing an existing wishlist (renaming, changing description)
 */
export const WishlistDialog: React.FC<TProps> = ({
  type,
  wishlistId,
  name,
  description,
  children,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const refForm = React.useRef<HTMLFormElement>(null);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const handleSubmit = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const wishlistData = { name, description };

    try {
      let result;
      if (type === "add") {
        result = await addWishlist({ wishlistData });
      }

      if (type === "edit") {
        result = await editWishlist({ wishlistData, wishlistId });
      }

      if (result.error || !result.data) {
        throw new Error(getErrorMessage(result.error));
      }

      if (result.data) {
        refForm.current?.reset();
        toast.success(
          type === "add"
            ? "Wishlist was successfully created"
            : "Wishlist was updated"
        );
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to save wishlist"));
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={toggleOpen}>
      {children}
      <Dialog.Portal>
        <DialogContent>
          <DialogCloseButton />
          <DialogTitle>
            {type === "add" ? "Add new" : "Edit"} wishlist
          </DialogTitle>

          <Form.Root
            ref={refForm}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(new FormData(e.currentTarget));
            }}
            className="flex flex-col gap-y-4 pt-6"
          >
            <FormField
              fieldName="name"
              label="Name your wishlist"
              isRequired
              initialValue={name}
            >
              <FieldError match="valueMissing">Name is required</FieldError>
            </FormField>

            <FormField
              fieldName="description"
              label="You can add description"
              initialValue={description}
            />

            <FormSubmitButton type={type} />
          </Form.Root>
        </DialogContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
