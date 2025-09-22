export type Dimension = {
  height: number;
  width: number;
  length: number;
};

// Product uses a flat format for dimensions as requested
export type Product = {
  id: string;
  name?: string;
  height: number;
  width: number;
  length: number;
};

export type Order = {
  id: string;
  products: Product[];
};

export type BoxSpec = {
  id: string;
  name: string;
  dimension: Dimension;
};

export type PackedBox = {
  boxId: string;
  boxName: string;
  products: Product[];
};

export type PackedOrder = {
  orderId: string;
  boxes: PackedBox[];
};
