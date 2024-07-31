import React, { forwardRef, useEffect, useRef, useState } from "react";
import addToCartIcon from "../../public/assets/images/icon-add-to-cart.svg";
import { TImage } from "../models/TProduct";
import {
  ACTIONS,
  useHasConfirmedOrder,
  useUpdateCart,
} from "../context/CartContext";

type ProductProps = {
  productImgPath: TImage;
  category: string;
  name: string;
  price: number;
};

const Product: React.FC<ProductProps> = ({
  productImgPath,
  category,
  name,
  price,
}) => {
  const setCart = useUpdateCart()!;
  const isHighlightedRef = useRef<boolean>(false);

  function updateCart(quantity: number) {
    if (quantity > 0) {
      setCart({
        type: ACTIONS.ADD_TO_CART,
        payload: {
          name,
          quantity,
          price: price.toFixed(2),
          totalPrice: (price * quantity).toFixed(2),
          productThumbnail: productImgPath.thumbnail,
        },
      });
    } else {
      setCart({
        type: ACTIONS.REMOVE_TO_CART,
        payload: {
          name,
        },
      });
    }
  }

  function setIsHighlighted(isHighlighted: boolean) {
    isHighlightedRef.current = isHighlighted;
  }

  return (
    <article
      className={`bg-white rounded-md hover:-translate-y-1 hover:shadow-xl xs:rounded-lg outline-2 focus-visible:outline-red-custom outline-offset-2 transition-transform duration-300 ${
        isHighlightedRef.current ? "outline outline-red-custom" : ""
      }`}
      aria-labelledby={name}
      tabIndex={0}
    >
      <picture className="relative">
        <source media="(min-width: 1024px)" srcSet={productImgPath.desktop} />
        <source media="(min-width: 640px)" srcSet={productImgPath.tablet} />
        <img
          className="min-w-full rounded-md xs:rounded-lg"
          src={productImgPath.mobile}
          alt={`${name} "image"`}
        />
        <AddToCartButton
          updateCart={updateCart}
          setIsHighlighted={setIsHighlighted}
        />
      </picture>

      <div className="p-2 mt-11">
        <p className="text-lg text-rose-500">{category}</p>
        <p className="text-xl redHatTextBold text-rose-900" id="name">
          {name}
        </p>
        <p className="text-xl redHatTextSemiBold text-red-custom">
          ${price.toFixed(2)}
        </p>
      </div>
    </article>
  );
};

type AddToCartButtonProps = {
  updateCart: (quantity: number) => void;
  setIsHighlighted: (isHighlighted: boolean) => void;
};

function AddToCartButton({
  updateCart,
  setIsHighlighted,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(0);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const hasConfirmedOrder = useHasConfirmedOrder();

  useEffect(() => {
    updateCart(quantity);
    if (quantity > 0) setIsHighlighted(true);
    else if (quantity < 1) setIsHighlighted(false);
  }, [quantity]);

  useEffect(() => {
    if (!hasConfirmedOrder) {
      setIsAddedToCart(false);
      setQuantity(0);
    }
  }, [hasConfirmedOrder]);

  const decrementButtonRef = useRef<SVGSVGElement | null>(null);
  const incrementButtonRef = useRef<SVGSVGElement | null>(null);

  function handleQuantity(
    event:
      | React.MouseEvent<SVGSVGElement>
      | React.KeyboardEvent<SVGSVGElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>,
    type: string
  ) {
    event.stopPropagation(); // Prevent the event from bubbling up
    event.preventDefault();
    if (type === "increase") {
      setQuantity((previousQuantity) => previousQuantity + 1);
    } else if (type === "decrease" && quantity > 0) {
      setQuantity((previousQuantity) => previousQuantity - 1);
    }
  }

  function handleKeyDown(
    event: React.KeyboardEvent<SVGSVGElement>,
    type: string
  ) {
    if (event.key === "Enter" || event.key === " ") {
      handleQuantity(event, type);
    } else if (event.key === "ArrowRight") {
      if (type === "decrease") {
        incrementButtonRef!.current!.focus();
      }
    } else if (event.key === "ArrowLeft") {
      if (type === "increase") {
        decrementButtonRef!.current!.focus();
      }
    }
  }

  return (
    <div className="absolute bottom-0 flex justify-center w-full translate-y-2/4 left-2/4 -translate-x-2/4">
      {!isAddedToCart ? (
        <button
          className="flex bg-white border-rose-500 border items-center xs:rounded-full xs:py-3.5 py-3 w-full rounded-md gap-2.5 justify-center xs:px-8 xs:max-w-fit"
          type="button"
          onClick={(e) => {
            handleQuantity(e, "increase");
            setIsAddedToCart(true);
          }}
        >
          <img
            className="size-6"
            src={addToCartIcon}
            alt="Add to cart icon"
            aria-hidden
          />
          <span className="redHatTextBold text-rose-900">Add to Cart</span>
        </button>
      ) : (
        <button
          className="flex bg-red-custom border-rose-500 border py-3 w-full rounded-md gap-2.5 xs:rounded-full xs:py-3.5 items-center justify-evenly xs:max-w-48"
          type="button"
        >
          <QuantityButton
            type="decrease"
            ariaLabel="Decrease quantity"
            alt="Decrease quantity"
            handleQuantity={handleQuantity}
            handleKeyDown={handleKeyDown}
            ref={decrementButtonRef}
          />
          <span className="text-white">{quantity}</span>
          <QuantityButton
            type="increase"
            ariaLabel="Increase quantity"
            alt="Increase quantity"
            handleQuantity={handleQuantity}
            handleKeyDown={handleKeyDown}
            ref={incrementButtonRef}
          />
        </button>
      )}
    </div>
  );
}
type QuantityProps = {
  type: string;
  ariaLabel: string;
  alt: string;
  handleQuantity: (e: React.MouseEvent<SVGSVGElement>, type: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<SVGSVGElement>, type: string) => void;
};
const QuantityButton = forwardRef<SVGSVGElement, QuantityProps>(
  ({ type, ariaLabel, alt, handleQuantity, handleKeyDown }, ref) => {
    return (
      <svg
        className="text-white rounded-full hover:text-red-custom outline outline-1 outline-white outline-offset-2 hover:bg-white hover:outline-offset-0 size-4 focus-visible:outline-white focus-visible:outline-2 focus-visible:bg-white focus-visible:text-red-custom"
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        fill="none"
        viewBox={type === "increase" ? "0 0 10 10" : "0 0 10 2"}
        role="button"
        aria-label={ariaLabel}
        onClick={(e) => handleQuantity(e, type)}
        onKeyDown={(e) => handleKeyDown(e, type)}
        tabIndex={0}
        ref={ref}
      >
        <title id="titleID">{alt}</title>
        {type === "increase" ? (
          <path
            fill="currentColor"
            d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"
          />
        ) : (
          <path fill="currentColor" d="M0 .375h10v1.25H0V.375Z" />
        )}
      </svg>
    );
  }
);

export default Product;
