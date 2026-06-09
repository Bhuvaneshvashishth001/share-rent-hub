import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

const app = import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
) : <App />;

createRoot(document.getElementById("root")!).render(app);
