import { getWishlist } from '@/actions/getWishlist';
import { getWishlists } from '@/actions/getWishlists';
import { ProductInWishlist } from '@/components/ProductInWishlist';
import { TPageProps } from '@/types/params.types';
import { TWishlistForUI } from '@/types/wishlists.types';
import { getErrorMessage } from '@/utils/getErrorMessage';

type TProps = TPageProps<{ wishlistId: ID }>;

const Wishlist: React.FC<TProps> = async ({ params }) => {
  const { wishlistId } = await params;

  const [wishlistResult, allWishlistsResult] = await Promise.all([
    getWishlist({ wishlistId, userId: "u1" }),
    getWishlists("u1"),
  ]);

  const { data, error } = wishlistResult;
  const { data: allWishlists, error: allWishlistsError } = allWishlistsResult;

  if (error || !data) {
    throw new Error(getErrorMessage(error));
  }

  if (allWishlistsError || !allWishlists) {
    throw new Error(getErrorMessage(error));
  }

  const wishlist: TWishlistForUI = data;

  return (
    <>
      <h1 className="text-2xl font-semibold">{wishlist.name}</h1>
      <p>{wishlist.description}</p>

      <ul className="flex flex-col gap-4">
        {wishlist.products.map((product) => (
          <li key={product.id}>
            <ProductInWishlist
              product={product}
              wishlistId={wishlist.id}
              wishlists={allWishlists}
            />
          </li>
        ))}
      </ul>
    </>
  );
};

export default Wishlist;
