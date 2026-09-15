import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
      alias: {
        "@": import.meta.dirname + "/src",
      },
  },
  server: {
     proxy: {
       '/api': {
         target: 'http://localhost:3000',
         changeOrigin: true
       }
     }
   }
})
