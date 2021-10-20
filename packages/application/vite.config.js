import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import WindiCss from "vite-plugin-windicss";

const pathSrc = path.resolve(__dirname, "./src");
const pathEnv = path.resolve(__dirname, "./env");

export default defineConfig(({ mode }) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("dotenv").config({ path: `env/.env.${mode}` });
  return {
    plugins: [
      vue({
        isProduction: false,
      }),
      WindiCss(),
    ],
    server: {
      port: process.env.PORT,
    },
    envDir: pathEnv,
    resolve: {
      alias: [
        {
          find: "@",
          replacement: pathSrc,
        },
      ],
    },
  };
});
