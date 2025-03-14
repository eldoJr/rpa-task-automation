import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // Adicione esta importação

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Garante que o alias '@' aponte para 'src'
    },
  },
});
