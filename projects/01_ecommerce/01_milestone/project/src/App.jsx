/**
 * App.jsx
 * This is the root component of the application. It combines the Header and Main components
 * to create the overall structure of the page.
 */

import Header from "./components/Header";
import Main from "./components/Main";
import Button from "./components/Button"

function App() {
  return (
    <div className="App">
      {/* Header Component */}
      <Header title= "My E-Commerce Store" subtitle="Welcome to our store"/>
      <Header title= "Second header title variant" subtitle="Browse our collection"/>
      <Header title= "Third variant"/>

      <Button onClick={() => alert("button clicked")} title="click me"/>

      {/* Main Content Component */}
      <Main />
    </div>
  );
}

export default App;
