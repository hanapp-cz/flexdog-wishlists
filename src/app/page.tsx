import Image from 'next/image';
import Link from 'next/link';

import { TPageProps } from '@/types/params.types';
import { TProduct } from '@/types/products.types';

type TProps = TPageProps;

const getProducts = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, {
    cache: "no-store",
  });

  return await res.json();
};

const Home: React.FC<TProps> = async () => {
  const { data, error } = await getProducts();

  if (error || !data) {
    return <div>Error loading products</div>;
  }

  const products: RoA<TProduct> = data;

  return (
    <main className="min-h-full">
      <h1>Products</h1>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(275px,1fr))] gap-8">
        {products.map((product) => (
          <li key={product.id}>
            <Link href={`/product/${product.id}`} className="underline">
            {product.name}
            </Link>

            <Image
              src={product.image}
              alt={product.name}
              width={275}
              height={275}
            />
            <p>{product.price} CZK</p>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Home;
