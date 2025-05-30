"use client";

import Link from "next/link";

export default function Error({ error }: { error: Error }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-red-600">
        <h2>Something went wrong!</h2>
        <p>{error.message}</p>
      </div>
      <Link href="/" className="underline">
        View Products
      </Link>
    </div>
  );
}
