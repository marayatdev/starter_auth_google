import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ""));
  return {
    plugins: [react()],
    server: {
      headers: {
        "Cross-Origin-Opener-Policy": "same-origin",
        "Cross-Origin-Embedder-Policy": "require-corp",
      },
      host: true,
      strictPort: true,
      port: Number(process.env.VITE_PORTS),
      proxy: {
        "/api": {
          target: process.env.VITE_URL_ENDPOINT_API,
          changeOrigin: true,
        },
      },
    },
  };
});
