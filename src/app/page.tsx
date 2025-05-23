import Image from 'next/image';

type TProduct = {
  id: ID;
  name: string;
  price: number;
  image: string;
  isInStock: boolean;
};

const getProducts: () => Promise<RoA<TProduct>> = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, {
    cache: "no-store",
  });

  return await res.json();
};

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="min-h-full">
      <h1>Products</h1>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(275px,1fr))] gap-8">
        {products.map((product) => (
          <li key={product.id}>
            {product.name}
            <Image
              src={product.image}
              alt={product.name}
              width={275}
              height={275}
            />
          </li>
        ))}
      </ul>
    </main>
  );
}
