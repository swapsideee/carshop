export type CartOption = 'pair' | 'set';

export type CartItem = {
  id: string;
  productId: number;
  option: CartOption;
  price: number;
  quantity?: number;

  name?: string;
  image?: string;

  [key: string]: unknown;
};

export type PastOrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

export type SaveOrderInput = {
  items: PastOrderItem[];
  total: number;
  name: string;
  phone: string;
  email: string;
  comment: string;
  createdAt: string;
  paid: true;
  stripeSessionId: string;
};

export type PastOrder = SaveOrderInput & { id: string };

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
  saveOrder: (orderData: SaveOrderInput) => CartActionResult;
};
