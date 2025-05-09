/**
 * App.jsx - Milestone 3
 * Root component for the application. Combines Header and Main components.
 * Adds functionality for search and category filters.
 */

import { useState } from "react";
import Header from "./components/Header";
import Main from "./components/Main";

function App() {
  // State for managing search and category filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cart, setCart] = useState([]);

  return (
    <div className="App">
      {/* Header Component */}
      <Header cartCount={cart.length} />

      {/* Main Content Component with Search and Filter Logic */}
      <Main
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        setCart={setCart}
      />
    </div>
  );
}

export default App;
