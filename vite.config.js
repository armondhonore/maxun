import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig(() => {
  const publicUrl = process.env.VITE_PUBLIC_URL || 'http://localhost:5173';

  return {
    define: {
      'import.meta.env.VITE_BACKEND_URL': JSON.stringify(process.env.VITE_BACKEND_URL),
      'import.meta.env.VITE_PUBLIC_URL': JSON.stringify(publicUrl),
    }, 
    server: {
      // Bind all interfaces so the pod's Service can reach the dev server
      // (parsing the bind host from VITE_PUBLIC_URL pins it to a name that
      // does not exist as a local interface -> unreachable -> 502/503).
      host: true,
      port: 5173,
      // Vite 6 enforces allowedHosts; the Nexlayer public domain differs from
      // VITE_PUBLIC_URL, so accept any Host header or it returns "host not
      // allowed".
      allowedHosts: true,
    },
    preview: {
      host: true,
      port: 5173,
      allowedHosts: true,
    },
    build: {
      outDir: 'build',
      manifest: true,
      chunkSizeWarningLimit: 1024,
    },
    plugins: [react()],
  };
});