import Image from 'next/image';

import { TPageProps } from '@/types/params.types';
import { TProduct } from '@/types/products.types';

type TProps = TPageProps<{ productId: ID }>;

const getProduct = async (productId: ID) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${productId}`,
    {
      cache: "no-store",
    }
  );

  return await response.json();
};

const Product: React.FC<TProps> = async ({ params }) => {
  const { productId } = await params;
  const { data, error } = await getProduct(productId);

  if (error || !data) {
    return <div>Error loading product</div>;
  }

  const product: TProduct = data;

  return (
    <main className="min-h-full">
      <h1>Product</h1>
      <div>
        <h2>{product.name}</h2>
        <p>{product.price} CZK</p>
        <Image
          src={product.image}
          alt={product.name}
          width={275}
          height={275}
        />
      </div>
    </main>
  );
};

export default Product;
