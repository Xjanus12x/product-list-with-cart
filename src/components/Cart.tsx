import illustrationEmptyCart from "../../public/assets/images/illustration-empty-cart.svg";
import carbonNeutral from "../../public/assets/images/icon-carbon-neutral.svg";
import removeItemIcon from "../../public/assets/images/icon-remove-item.svg";
import {
  ACTIONS,
  getOrderTotal,
  useCart,
  useSetHasConfirmedOrder,
  useUpdateCart,
} from "../context/CartContext";
import TCart from "../models/TCart";
import { useMemo } from "react";

function Cart() {
  const cart = useCart();

  return (
    <article className="grid p-8 overflow-auto rounded-lg bg-rose-50">
      <header>
        <h2 className="text-3xl redHatTextBold text-red-custom xl:text-xl">
          Your Cart ({cart.length})
        </h2>
      </header>
      {cart.length > 0 ? <CartItems cart={cart} /> : <EmptyCart />}
    </article>
  );
}

function EmptyCart() {
  return (
    <>
      <img
        className="mx-auto mt-10 mb-4"
        src={illustrationEmptyCart}
        alt="Chocolate cake with slice"
        aria-hidden
      />
      <p className="text-center redHatTextSemiBold text-rose-500">
        Your added items will appear here
      </p>
    </>
  );
}

type CartItemsProps = {
  cart: TCart[];
};
function CartItems({ cart }: CartItemsProps) {
  const setCart = useUpdateCart()!;
  const setHasConfirmedOrder = useSetHasConfirmedOrder();
  function handleRemoveItem(name: string) {
    setCart({
      type: ACTIONS.REMOVE_TO_CART,
      payload: {
        name,
      },
    });
  }
  const totalOrder = useMemo(() => getOrderTotal(cart).toFixed(2), [cart]);
  return (
    <>
      <ul className="max-h-[50svh] overflow-auto">
        {cart.map(({ name, quantity, price, totalPrice }: TCart, index) => {
          return (
            <li
              className="flex items-center justify-between py-4 border-b"
              key={index}
            >
              <div className="space-y-2">
                <h3 className="redHatTextSemiBold text-rose-900">{name}</h3>
                <span className="flex flex-wrap gap-4">
                  <span className="text-red-custom redHatTextSemiBold">
                    {quantity}x
                  </span>

                  <span className="text-rose-400">@ ${price}</span>
                  <span className="text-rose-500 redHatTextSemiBold">
                    ${totalPrice}
                  </span>
                </span>
              </div>
              <button
                className="grid border rounded-full cursor-pointer border-rose-500 size-5 place-content-center hover:brightness-0"
                onClick={() => handleRemoveItem(name)}
              >
                <img src={removeItemIcon} alt="Cross icon" />
              </button>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center justify-between py-5">
        <p className="redHatTextSemiBold text-rose-900">Order Total</p>
        <p className="text-3xl redHatTextBold text-rose-900">${totalOrder}</p>
      </div>

      <div className="flex items-center justify-center gap-3 px-4 py-4 rounded-lg bg-rose-100">
        <img
          className="md:size-6"
          src={carbonNeutral}
          alt="Tree icon"
          aria-hidden
        />
        <p className="text-sm redHatTextSemiBold text-rose-500 md:text-base">
          This is a
          <span className="text-rose-900 redHatTextSemiBold">
            {" "}
            carbon-neutral{" "}
          </span>
          delivery
        </p>
      </div>

      <button
        className="py-4 text-white rounded-full bg-red-custom redHatTextSemiBold hover:bg-[#952C0C] mt-7"
        onClick={() => setHasConfirmedOrder(true)}
      >
        Confirm Order
      </button>
    </>
  );
}

export default Cart;
