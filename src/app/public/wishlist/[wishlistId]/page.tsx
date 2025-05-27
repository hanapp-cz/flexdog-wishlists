import { getWishlist } from '@/actions/getWishlist';
import { Wishlist } from '@/components/Wishlist';
import { TPageProps } from '@/types/params.types';
import { TWishlistForUI } from '@/types/wishlists.types';
import { getErrorMessage } from '@/utils/getErrorMessage';

type TProps = TPageProps<{ wishlistId: ID }>;

const PublicWishlistPage: React.FC<TProps> = async ({ params }) => {
  const { wishlistId } = await params;
  const { data, error } = await getWishlist({ wishlistId });

  if (error || !data) {
    throw new Error(getErrorMessage(error));
  }

  const userId = process.env.USER_ID ?? null;

  if (!userId && !data.isPublic) {
    throw new Error("This wishlist is private");
  }

  const wishlist: TWishlistForUI = data;

  return <Wishlist wishlist={wishlist} />;
};

export default PublicWishlistPage;
