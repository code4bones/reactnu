import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["builder.undoo.ru"],
    cors: {
      origin: [/^https?:\/\/builder\.undoo\.ru$/]
    },
    host: "0.0.0.0",
    port: 5174
  },
  resolve: {
    alias: {
      "@deadragdoll/reactnu/styles.css": resolve(
        __dirname,
        "../../packages/ui/dist/styles.css"
      ),
      "@deadragdoll/reactnu": resolve(__dirname, "../../packages/ui/src")
    }
  }
});
