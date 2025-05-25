import * as React from 'react';

import Link from 'next/link';

import { cn } from '@/utils/cn';

type TProps = RequiredChildren & {
  className?: DivClassName;
};

type TExtendedCard = React.FC<TProps> & {
  Headline: typeof CardHeadline;
  GoToDetail: typeof CardGoToDetail;
};

export const Card: TExtendedCard = ({ children, className }) => {
  return (
    <article
      className={cn(
        "relative isolate",
        "flex flex-col items-start",
        "rounded-2xl overflow-hidden",
        "border border-gray-300",
        "bg-zinc-50 hover:bg-zinc-100 transition-colors",
        className
      )}
    >
      {children}
    </article>
  );
};

type THeadlineProps = RequiredChildren & {
  href: PropsOf<typeof Link>["href"];
  className?: React.HTMLAttributes<HTMLHeadingElement>["className"];
};

const CardHeadline: React.FC<THeadlineProps> = ({
  children,
  href,
  className,
}) => {
  return (
    <h2 className={cn("text-base font-semibold tracking-tight", className)}>
      <Link href={href}>
        <span className="absolute inset-0 z-10"></span>
        {children}
      </Link>
    </h2>
  );
};

const CardGoToDetail: React.FC<NoChildren> = () => {
  return (
    <div
      aria-hidden="true"
      className="flex items-center text-sm font-medium text-purple-600"
    >
      Go to detail &rarr;
    </div>
  );
};

Card.Headline = CardHeadline;
Card.GoToDetail = CardGoToDetail;
