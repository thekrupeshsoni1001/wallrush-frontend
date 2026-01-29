import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { SavedProvider } from "./context/SavedContext";
import { CollectionProvider } from "./context/CollectionContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="132258786472-bj4soohfurknpbrk6t84i8onqamh1543.apps.googleusercontent.com">
      <AuthProvider>
        <SavedProvider>
          <CollectionProvider>
            <App />
          </CollectionProvider>
        </SavedProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
