import { getWishlist } from '@/actions/getWishlist';
import { getWishlists } from '@/actions/getWishlists';
import { Wishlist } from '@/components/Wishlist';
import { TPageProps } from '@/types/params.types';
import { TWishlistForUI } from '@/types/wishlists.types';
import { getErrorMessage } from '@/utils/getErrorMessage';

type TProps = TPageProps<{ wishlistId: ID }>;

const WishlistPage: React.FC<TProps> = async ({ params }) => {
  const { wishlistId } = await params;

  const [wishlistResult, allWishlistsResult] = await Promise.all([
    getWishlist({ wishlistId }),
    getWishlists(),
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

  return <Wishlist wishlist={wishlist} allWishlists={allWishlists} />;
};

export default WishlistPage;
