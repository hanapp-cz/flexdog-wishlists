import { Dialog } from 'radix-ui';

import { getWishlists } from '@/actions/getWishlists';
import { AddWishlistButton } from '@/components/AddWishlistButton';
import { WishlistCard } from '@/components/WishlistCard';
import { WishlistDialog } from '@/components/WishlistDialog';
import { TPageProps } from '@/types/params.types';
import { TWishListMetadata } from '@/types/wishlists.types';
import { getErrorMessage } from '@/utils/getErrorMessage';

type TProps = TPageProps;

const Wishlists: React.FC<TProps> = async () => {
  const { data, error } = await getWishlists("u1");

  if (error || !data) {
    throw new Error(getErrorMessage(error, "Failed to load wishlists"));
  }

  const wishlists: RoA<TWishListMetadata> = data;

  return (
    <>
      <h1 className="text-xl">My Wishlists</h1>

      <WishlistDialog type="add">
        <Dialog.Trigger asChild>
          <AddWishlistButton />
        </Dialog.Trigger>
      </WishlistDialog>

      <ul className="grid gap-4">
        {wishlists.map((wishlist) => (
          <WishlistCard key={wishlist.id} wishlist={wishlist} />
        ))}
      </ul>
    </>
  );
};

export default Wishlists;
