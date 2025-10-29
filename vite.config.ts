import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    allowedHosts: [
      "https://4ced2d16-13b2-43ef-a5bb-490e8d209438-00-1j5tlfevdd10t.janeway.replit.dev",
      "e9c16624-23c1-4d11-9f73-1f220cc87232-00-3adhsse8u0skx.janeway.replit.dev"
    ]
  }
})
