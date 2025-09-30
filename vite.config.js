import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import postcssNesting from 'postcss-nesting';
import path from 'path'
import { viteSingleFile } from 'vite-plugin-singlefile'
var MainHtmlPath = "index.html"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), viteSingleFile(),],
  build: {
    rollupOptions: {
      input: {
        // a: "./" + MainHtmlPath,
        indexPath: "index.html",
      },
      
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          }
          return `static/[name]/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'static/[name]/js/[name]-[hash].js',
        entryFileNames: 'static/[name]/js/[name]-[hash].js',
      },
    },
  },
  css: {
    postcss: {
      plugins: [
        postcssNesting
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      // '/api/playlist/': {
      //   target: 'http://dev.aecosign.ios',
      //   changeOrigin: true,
      //   // rewrite: (path) => path.replace(/^\/api/, ''),
      // },
      '/api': {
        target: 'http://dev.aecosign.io',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    cors:true,
    host:'127.0.0.1'
  }
})
