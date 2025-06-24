import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify('http://localhost:8085'),
    'import.meta.env.VITE_KAKAO_JS_KEY': JSON.stringify('0eaeed688e2125753c1a0ebf4df023be'),
  },
  server: {
    port: 5173,
    host: true,
  },
});
