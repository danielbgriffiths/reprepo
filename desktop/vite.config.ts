import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [solid()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@shared-components": path.resolve(__dirname, "./src/components/shared"),
      "@partial-components": path.resolve(__dirname, "./src/components/shared"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@models": path.resolve(__dirname, "./src/models"),
      "@views": path.resolve(__dirname, "./src/views"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
    },
  },
}));
