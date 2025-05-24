import * as React from "react";

import { Form } from "radix-ui";

type TProps = RequiredChildren & Pick<PropsOf<typeof Form.Message>, "match">;

export const FieldError: React.FC<TProps> = ({ children, match }) => {
  return (
    <Form.Message match={match} className="text-red-600 block mt-1 ml-1">
      {children}
    </Form.Message>
  );
};
