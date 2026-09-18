import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // public/assets holds the static images, so keep Vite's hashed bundles in a separate folder
  build: { assetsDir: "static" }
});
