/**
 * App.jsx
 * This is the root component of the application. It combines the Header and Main components
 * to create the overall structure of the page.
 */

import Header from "./components/Header";
import Main from "./components/Main";

function App() {
  return (
    <div className="App">
      {/* Header Component */}
      <Header />

      {/* Main Content Component */}
      <Main />
    </div>
  );
}

export default App;
