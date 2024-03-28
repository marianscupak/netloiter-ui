import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { z } from "zod";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: z.coerce.number().parse(process.env.FE_PORT),
  },
  preview: {
    port: z.coerce.number().parse(process.env.FE_PORT),
  },
  plugins: [react()],
});
