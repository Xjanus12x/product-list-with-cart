import {
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from "react";
import ReactDOM from "react-dom";
import confirmOrderIcon from "../../public/assets/images/icon-order-confirmed.svg";
import {
  ACTIONS,
  getOrderTotal,
  useCart,
  useHasConfirmedOrder,
  useSetHasConfirmedOrder,
  useUpdateCart,
} from "../context/CartContext";

const Portal = ({ children }: PropsWithChildren) => {
  const portalRoot = document.getElementById("portal-root");
  return ReactDOM.createPortal(children, portalRoot!);
};

function ConfirmOrder() {
  const hasConfirmedOrder = useHasConfirmedOrder();
  const setHasConfirmedOrder = useSetHasConfirmedOrder();
  const cart = useCart();
  const setCart = useUpdateCart();
  const [showConfirmOrder, setshowConfirmOrder] = useState(true);
  const totalOrder = useMemo(() => getOrderTotal(cart).toFixed(2), [cart]);
  useEffect(() => {
    if (hasConfirmedOrder) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [hasConfirmedOrder]);

  if (!hasConfirmedOrder) return null;
  function resetCart() {
    setshowConfirmOrder(false);
    setTimeout(() => {
      setHasConfirmedOrder(false);
      setCart({ type: ACTIONS.RESET_CART });
      setshowConfirmOrder(true);
    }, 400);
  }

  return (
    <Portal>
      <div className="absolute bottom-0 left-0 right-0 grid content-end bg-black bg-opacity-40 min-h-dvh md:content-center">
        <div
          className={`px-6 pt-10 pb-5 mx-auto rounded-t-xl bg-rose-50 md:rounded-xl md:py-10 md:max-w-xl md:container ${
            showConfirmOrder ? "slideIn" : "slideOut"
          }`}
        >
          <header className="space-y-3">
            <img
              className="mb-7"
              src={confirmOrderIcon}
              alt="Check icon"
              aria-hidden
            />
            <h2 className="text-4xl text-rose-900 redHatTextBold">
              Order Confirmed
            </h2>
            <p className="text-rose-500">We hope you enjoy your food!</p>
          </header>

          <ul className="w-full px-6 rounded-lg bg-rose-100 mt-7 max-h-[50svh] overflow-auto">
            {cart.map(({ productThumbnail, name, quantity, price }, index) => {
              return (
                <li
                  className="flex items-center gap-4 py-4 border-b"
                  key={index}
                >
                  <img
                    className="rounded-md size-14"
                    src={productThumbnail}
                    alt={name}
                  />
                  <div className="overflow-hidden">
                    <h3 className="truncate redHatTextBold text-rose-900">
                      {name}
                    </h3>
                    <span className="flex flex-wrap gap-4">
                      <span className="text-red-custom redHatTextSemiBold">
                        {quantity}x
                      </span>

                      <span className="text-rose-400">@ ${price}</span>
                    </span>
                  </div>

                  <p className="ml-auto text-md redHatTextSemiBold text-rose-900">
                    ${(+price * quantity).toFixed(2)}
                  </p>
                </li>
              );
            })}
            <li className="flex items-center justify-between py-4">
              <p className="text-rose-900">Order Total</p>
              <p className="text-3xl redHatTextBold text-rose-900">
                ${totalOrder}
              </p>
            </li>
          </ul>
          <button
            className="py-4 text-white rounded-full bg-red-custom redHatTextSemiBold hover:bg-[#952C0C] mt-7 min-w-full"
            onClick={resetCart}
          >
            Start New Order
          </button>
        </div>
      </div>
    </Portal>
  );
}

export default ConfirmOrder;
