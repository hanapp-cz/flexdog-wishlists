export type TProduct = {
  id: ID;
  name: string;
  price: number;
  image: string;
  isInStock: boolean;
};

export type TProductForUI = {
  id: ID;
  name: string;
  price: number;
  priceAtAddition: number;
  image: string;
  isInStock: boolean;
};

export type TProducts = Record<ID, TProduct>;
