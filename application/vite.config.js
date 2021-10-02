import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const pathSrc = path.resolve(__dirname, "./src");

export default defineConfig({
  plugins: [
    vue({
      isProduction: false,
    }),
  ],
  server: {
    port: 8080,
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: pathSrc,
      },
    ],
  },
});
