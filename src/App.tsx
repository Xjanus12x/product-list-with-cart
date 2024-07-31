import "./App.css";
import deserts from "../public/data.json";
import Cart from "./components/Cart";
import Product from "./components/Product";
import CartProvider from "./context/CartContext";
import TProduct from "./models/TProduct";
import ConfirmOrder from "./components/ConfirmOrder";

// Users should be able to:
// - Add items to the cart and remove them
// - Increase/decrease the number of items in the cart
// - See an order confirmation modal when they click "Confirm Order"
// - Reset their selections when they click "Start New Order"
// - View the optimal layout for the interface depending on their device's screen size
// - See hover and focus states for all interactive elements on the page

function App() {
  return (
    <CartProvider>
      <main className="bg-rose-100">
        <div className="grid gap-10 p-6 sm:container sm:mx-auto xl:grid-cols-desktop-layout sm:gap-5 xl:max-h-dvh xl:overflow-hidden">
          <section
            className="grid w-full gap-8 sm:py-6 md:py-10 lg:py-14 xl:max-h-dvh md:overflow-y-auto sm:px-4 md:px-8"
            role="region"
            aria-labelledby="desserts"
          >
            <header className="md:col-span-2 lg:col-span-3">
              <h1
                className="text-5xl text-rose-900 redHatTextBold "
                id="desserts"
              >
                Desserts
              </h1>
            </header>
            {deserts.map(
              ({ image, category, name, price }: TProduct, index) => {
                return (
                  <Product
                    productImgPath={image}
                    category={category}
                    name={name}
                    price={price}
                    key={index}
                  />
                );
              }
            )}
          </section>
          <section
            className="lg:container lg:mx-auto"
            role="region"
            aria-label="Shopping Cart"
          >
            <Cart></Cart>
          </section>
        </div>
      </main>
      <ConfirmOrder />
    </CartProvider>
  );
}

export default App;
