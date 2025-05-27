import Image from 'next/image';

import { getWishlists } from '@/actions/getWishlists';
import { AddToWishlistButton } from '@/components/AddToWishlistButton';
import { TPageProps } from '@/types/params.types';
import { TProduct } from '@/types/products.types';
import { TWishListMetadata } from '@/types/wishlists.types';
import { getErrorMessage } from '@/utils/getErrorMessage';

type TProps = TPageProps<{ productId: ID }>;

const getProduct = async (productId: ID) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${productId}`
  );

  return await response.json();
};

const Product: React.FC<TProps> = async ({ params }) => {
  const { productId } = await params;

  const [productsResult, wishlistsResult] = await Promise.all([
    getProduct(productId),
    getWishlists(),
  ]);

  const { data, error } = productsResult;
  const { data: wishlistsData, error: wishlistsError } = wishlistsResult;

  if (error || !data) {
    throw new Error(getErrorMessage(error, "Failed to load product"));
  }

  if (wishlistsError || !wishlistsData) {
    throw new Error(
      getErrorMessage(wishlistsError, "Failed to load wishlists")
    );
  }

  const product: TProduct = data;
  const wishlists: RoA<TWishListMetadata> = wishlistsData;

  return (
    <>
      <div className="grid md:grid-cols-2 gap-4 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
        <div className="relative bg-white">
          <Image
            src={product.image}
            alt={product.name}
            width={500}
            height={500}
            className="w-full"
          />
          <AddToWishlistButton
            className="absolute top-4 right-4 shadow-md"
            productId={product.id}
            wishlists={wishlists}
          />
        </div>

        <div className="p-4">
          <h1 className="text-2xl">{product.name}</h1>
          <p>{product.price} CZK</p>
        </div>
      </div>
    </>
  );
};

export default Product;
