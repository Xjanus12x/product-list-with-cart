import React, {
  Dispatch,
  PropsWithChildren,
  useContext,
  useReducer,
  useState,
} from "react";
import TCart from "../models/TCart";

export const ACTIONS = {
  ADD_TO_CART: "ADD_TO_CART",
  REMOVE_TO_CART: "REMOVE_TO_CART",
  RESET_CART: "RESET_CART",
} as const; // 'as const' ensures the keys and values are readonly and literal;

// Define the types for the context

type CartAction =
  | { type: typeof ACTIONS.ADD_TO_CART; payload: TCart }
  | { type: typeof ACTIONS.REMOVE_TO_CART; payload: { name: string } }
  | { type: typeof ACTIONS.RESET_CART };

type CartContext = {
  cart: TCart[];
  setCart: Dispatch<CartAction>;
};

const CartContext = React.createContext<CartContext>({
  cart: [],
  setCart: () => {},
});

export function useCart() {
  return useContext(CartContext)?.cart;
}

export function useUpdateCart() {
  return useContext(CartContext)?.setCart;
}

type ConfirmedOrderContext = {
  hasConfirmedOrder: boolean | undefined;
  setHasConfirmedOrder: (hasConfirmedOrder: boolean) => void;
};
const ConfirmOrderContext = React.createContext<ConfirmedOrderContext>({
  hasConfirmedOrder: undefined,
  setHasConfirmedOrder: () => {},
});

export function useHasConfirmedOrder() {
  return useContext(ConfirmOrderContext).hasConfirmedOrder;
}
export function useSetHasConfirmedOrder() {
  return useContext(ConfirmOrderContext).setHasConfirmedOrder;
}
export function getOrderTotal(cart: TCart[]): number {
  return cart
    .filter((item) => item.quantity > 0)
    .reduce((acc: number, { totalPrice }: TCart) => {
      return acc + Number(totalPrice);
    }, 0);
}

function reducer(state: TCart[], action: CartAction): TCart[] {
  switch (action.type) {
    case ACTIONS.ADD_TO_CART:
      const oldItems: TCart[] = state.filter(
        (item) => item.name !== action.payload.name || item.quantity === 0
      );
      return [...oldItems, action.payload];

    case ACTIONS.REMOVE_TO_CART:
      return state.filter((item) => item.name !== action.payload.name);
    case ACTIONS.RESET_CART:
      return [];
    default:
      return state;
  }
}

type CartProviderProps = PropsWithChildren;
const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useReducer(reducer, []);
  const [hasConfirmedOrder, setHasConfirmedOrder] = useState(false);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      <ConfirmOrderContext.Provider
        value={{ hasConfirmedOrder, setHasConfirmedOrder }}
      >
        {children}
      </ConfirmOrderContext.Provider>
    </CartContext.Provider>
  );
};

export default CartProvider;
