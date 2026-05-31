import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), sentryVitePlugin({
    org: "rajan-org",
    project: "dopzy"
  })],

  build: {
    // Use hidden sourcemaps — uploaded to Sentry but not served to users
    sourcemap: 'hidden',

    // Chunk splitting for better caching and smaller initial loads
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          // React core — changes rarely, cached aggressively
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/react-router')) {
            return 'vendor-react';
          }
          // Supabase SDK
          if (id.includes('node_modules/@supabase')) {
            return 'vendor-supabase';
          }
          // Analytics (deferred anyway, but separating helps caching)
          if (id.includes('node_modules/posthog-js') || id.includes('node_modules/@sentry')) {
            return 'vendor-analytics';
          }
          // UI utilities
          if (id.includes('node_modules/lucide-react') || id.includes('node_modules/date-fns')) {
            return 'vendor-ui';
          }
        },
      },
    },
  },
})
