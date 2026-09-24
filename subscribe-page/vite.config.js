import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // relative paths, so the build runs at any address: its own host, a subfolder, a file:// preview
  base: "./"
});
