import { createRoot } from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./hooks/use-auth.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
