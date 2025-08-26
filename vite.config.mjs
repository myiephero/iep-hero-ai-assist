import react from "@vitejs/plugin-react";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

/** @type {import("vite").UserConfig} */
export default {
  resolve: {
    alias: {
      "@": "/client/src"
    }
  },
  plugins: [react(), runtimeErrorOverlay()],
};