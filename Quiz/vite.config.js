import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/socket.io': {
        target: 'http://localhost:5000',  // Your backend server URL
        changeOrigin: true,
        ws: true,  // This enables WebSocket proxying
        secure: false,
      },
    },
  },
});
