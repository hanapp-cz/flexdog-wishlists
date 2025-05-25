import { getWishlists } from '@/actions/getWishlists';
import { ProductCard } from '@/components/ProductCard';
import { TPageProps } from '@/types/params.types';
import { TProduct } from '@/types/products.types';
import { TWishListMetadata } from '@/types/wishlists.types';
import { getErrorMessage } from '@/utils/getErrorMessage';

type TProps = TPageProps;

const getProducts = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products`,
    {}
  );

  return await res.json();
};

const Home: React.FC<TProps> = async () => {
  const [productsResult, wishlistsResult] = await Promise.all([
    getProducts(),
    getWishlists("u1"),
  ]);

  const { data, error } = productsResult;
  const { data: wishlistsData, error: wishlistsError } = wishlistsResult;

  if (error || !data) {
    throw new Error(getErrorMessage(error, "Failed to load products"));
  }

  if (wishlistsError || !wishlistsData) {
    throw new Error(getErrorMessage(error, "Failed to load wishlists"));
  }

  const products: RoA<TProduct> = data;
  const wishlists: RoA<TWishListMetadata> = wishlistsData;

  return (
    <>
      <h1>Products</h1>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(275px,1fr))] gap-8">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            wishlists={wishlists}
          />
        ))}
      </ul>
    </>
  );
};

export default Home;
