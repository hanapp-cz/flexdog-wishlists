import * as React from 'react';

import { cn } from '@/utils/cn';

type TProps = NoChildren & {
  icon: React.ReactNode;
  onClick?: () => void;
  className?: ButtonClassName;
  srText: string;
};

export const ButtonIcon: React.FC<TProps> = ({
  className,
  icon,
  onClick,
  srText,
  ...props
}) => {
  return (
    <button
      className={cn("bg-white p-2 rounded-[50%] cursor-pointer", className)}
      onClick={onClick}
      {...props}
    >
      {icon}
      <span className="sr-only">{srText}</span>
    </button>
  );
};
