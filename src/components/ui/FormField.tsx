import * as React from "react";

import { Form } from "radix-ui";

type TFieldProps = PropsOf<typeof Form.Field>;

type TProps = Children & {
  fieldName: TFieldProps["name"];
  type?: React.HTMLInputTypeAttribute | "textarea";
  label?: string;
  isRequired?: boolean;
  minLength?: number;
};

export const FormField: React.FC<TProps> = ({
  children,
  fieldName,
  label,
  type = "text",
  isRequired = false,
  minLength,
}) => {
  const inputProps = {
    type,
    minLength,
    name: fieldName,
    required: isRequired,
    className: "mt-1 w-full border border-gray-300 rounded-md p-2",
  };

  const isTextArea = type === "textarea";
  const renderInput = () => {
    if (isTextArea) return <textarea rows={5} {...inputProps} />;
    return <input {...inputProps} />;
  };

  return (
    <Form.Field name={fieldName}>
      <Form.Label className="block text-sm font-medium">
        {label} {isRequired && <span className="text-red-600">*</span>}
      </Form.Label>
      <Form.Control asChild>{renderInput()}</Form.Control>
      {children}
    </Form.Field>
  );
};
