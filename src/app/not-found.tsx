import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <h2>Page Not Found</h2>
        <p>There is nothing here!</p>
      </div>

      <Link href="/" className="underline">
        View Products
      </Link>
    </div>
  );
}
