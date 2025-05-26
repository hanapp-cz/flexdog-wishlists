import { notFound } from "next/navigation";

import { getWishlist } from "@/actions/getWishlist";
import { Wishlist } from "@/components/Wishlist";
import { TPageProps } from "@/types/params.types";
import { TWishlistForUI } from "@/types/wishlists.types";
import { getErrorMessage } from "@/utils/getErrorMessage";

type TProps = TPageProps<{ wishlistId: ID }>;

const PublicWishlistPage: React.FC<TProps> = async ({ params }) => {
  const { wishlistId } = await params;
  const { data, error } = await getWishlist({ wishlistId, userId: "u1" });

  if (error || !data) {
    throw new Error(getErrorMessage(error));
  }

  const wishlist: TWishlistForUI = data;

  if (!wishlist.isPublic) {
    return notFound();
  }

  return <Wishlist wishlist={wishlist} />;
};

export default PublicWishlistPage;
