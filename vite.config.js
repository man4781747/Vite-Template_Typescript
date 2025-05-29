import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import postcssNesting from 'postcss-nesting'
import path from 'path'
var MainHtmlPath = 'index.html'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        // a: "./" + MainHtmlPath,
        indexPath: 'index.html',
      },

      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1)
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img'
          }
          return `static/[name]/${extType}/[name]-[hash][extname]`
        },
        chunkFileNames: 'static/[name]/js/[name]-[hash].js',
        entryFileNames: 'static/[name]/js/[name]-[hash].js',
      },
    },
  },
  css: {
    postcss: {
      plugins: [postcssNesting],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  // root: 'src',
  // server: {
  //   open: MainHtmlPath
  // }
  test: {
    // Vitest configuration
    globals: true, // Use global APIs
    environment: 'jsdom', // Use jsdom for DOM environment
    deps: {
      inline: ['@vue', '@vueuse', 'vitest-canvas-mock'], // Ensure Vue components are processed correctly
    },
    environmentOptions: {
      // Options for jsdom
      jsdom: {
        resources: 'usable',
      },
    },
    // setupFiles: ['./vitest.setup.ts'], // Optional: if setup files are needed
  },
})
