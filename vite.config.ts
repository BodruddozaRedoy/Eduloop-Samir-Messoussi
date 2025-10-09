import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import fs from "fs";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 6868,
    host: true,
    allowedHosts: ["*"],
    // Optional HTTPS for local development
    // https: {
    //   key: fs.readFileSync("./localhost-key.pem"),
    //   cert: fs.readFileSync("./localhost.pem"),
    // },
  },
  // 👇 Add this for production deploys (important for Vercel + React Router)
  build: {
    outDir: "dist",
  },
  // 👇 Ensures correct routing and asset paths on Vercel
  base: "/",
});
