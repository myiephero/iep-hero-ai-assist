import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("Main.tsx is loading...");
createRoot(document.getElementById("root")!).render(<App />);
console.log("App rendered successfully");
