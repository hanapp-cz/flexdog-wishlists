import Image from 'next/image';

import { AddToWishlistButton } from '@/components/AddToWishlistButton';
import { TPageProps } from '@/types/params.types';
import { TProduct } from '@/types/products.types';
import { cn } from '@/utils/cn';

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
    <main
      className={cn(
        "min-h-full container mx-auto",
        "grid md:grid-cols-2 gap-8",
        "px-4 py-16"
      )}
    >
      <div className="rounded-2xl relative overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          width={500}
          height={500}
          className="w-full "
        />
        <AddToWishlistButton
          className="absolute top-4 right-4"
          productId={product.id}
          wishlistId="w1" // TODO: Replace with actual wishlist ID
          userId="u1" // TODO: Replace with actual user ID
        />
      </div>

      <div>
        <h1 className="text-2xl">{product.name}</h1>
        <p>{product.price} CZK</p>
      </div>
    </main>
  );
};

export default Product;
