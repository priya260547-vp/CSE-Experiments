import { useSelector, useDispatch } from "react-redux";
import { addToCart, clearCart } from "./features/cart/cartSlice";
import products from "./data/products";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  return (
    <div className="container">
      <h1>🛒 Redux Shopping Cart</h1>

      <h2>Products</h2>

      <div className="products">
        {products.map((product) => (
          <div className="card" key={product.id}>
            <h3>{product.name}</h3>
            <p>Price: £{product.price}</p>

            <button onClick={() => dispatch(addToCart(product))}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <hr />

      <h2>Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p>Cart is Empty</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id}>
              <p>
                <strong>{item.name}</strong> × {item.quantity}
              </p>
            </div>
          ))}

          <button onClick={() => dispatch(clearCart())}>
            Clear Cart
          </button>
        </>
      )}
    </div>
  );
}

export default App;
