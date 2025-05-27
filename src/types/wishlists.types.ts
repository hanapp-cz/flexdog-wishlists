import { TProductForUI } from './products.types';

// * Server types
export type TWishlistProduct = {
  id: ID;
  price: number;
};

export type TWishlist = {
  id: ID;
  name: string;
  description?: string;
  isPublic: boolean;
  isDefault: boolean;
  products: RoA<TWishlistProduct>;
};

// * UI types
export type TWishListMetadata = {
  id: ID;
  name: string;
  description?: string;
  isPublic: boolean;
  isDefault: boolean;
  productsCount: number;
};

export type TWishlistForUI = OmitSafe<TWishlist, "products"> & {
  products: RoA<TProductForUI>;
};
