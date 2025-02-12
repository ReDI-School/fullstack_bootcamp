/**
 * App.jsx - Milestone 2
 * This is the root component of the application. It combines the Header and Main components
 * and manages the state for the shopping cart.
 */

import { useState } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import ProductCard from "./components/ProductCard";

function App() {
  // State for the cart
  const [cart, setCart] = useState([]);

  // Function to add a product to the cart
  const handleAddToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
  };

  return (
    <div className="App">
      {/* Header Component with Cart Count */}
      <Header cartCount={cart.length} />

      {/* Main Content Component */}
      <Main onAddToCart={handleAddToCart} />
    </div>
  );
}

export default App;
