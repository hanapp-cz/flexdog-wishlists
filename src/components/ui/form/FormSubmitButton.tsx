"use client";

import * as React from 'react';
import { useFormStatus } from 'react-dom';

import { Form } from 'radix-ui';

type TProps = NoChildren & {
  type?: "add" | "edit";
};

export const FormSubmitButton: React.FC<TProps> = ({ type = "add" }) => {
  const status = useFormStatus();

  return (
    <Form.Submit asChild>
      <button
        type="submit"
        disabled={status.pending}
        className="cursor-pointer bg-purple-500 text-white font-semibold p-4 rounded-md hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status.pending
          ? `${type === "add" ? "Creating" : "Updating"} wishlist`
          : `${type === "add" ? "Create new" : "Update"} wishlist`}
      </button>
    </Form.Submit>
  );
};
