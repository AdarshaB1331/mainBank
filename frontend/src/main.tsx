import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import "./index.css"; // Assuming no need to type the CSS import
import userStore from "./store"; // Remove the `.js` extension
import App from "./App";

// Ensure the root element exists and is typed correctly
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found. Ensure it exists in index.html.");
}

// Render the app
createRoot(rootElement).render(
  <StrictMode>
    <Provider store={userStore}>
      <App />
    </Provider>
  </StrictMode>
);
