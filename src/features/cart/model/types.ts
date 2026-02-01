export type CartItem = {
  id: string;
  price: number;
  quantity?: number;

  name?: string;
  image?: string;

  [key: string]: unknown;
};

export type PastOrder = {
  id: string;
  [key: string]: unknown;
};

export type CartActionResultOk = { ok: true } & Record<string, unknown>;
export type CartActionResultFail = { ok: false; message: string } & Record<string, unknown>;
export type CartActionResult = CartActionResultOk | CartActionResultFail;

export type CartStore = {
  cartItems: CartItem[];
  pastOrders: PastOrder[];

  addToCart: (product: CartItem) => CartActionResult;
  increment: (id: string) => CartActionResult;
  decrement: (id: string) => CartActionResult;
  removeFromCart: (id: string) => CartActionResult;
  clearCart: () => CartActionResult;
  saveOrder: (orderData: Record<string, unknown>) => CartActionResult;
};
