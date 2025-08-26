// Ultra-minimal Vite config for troubleshooting
const { defineConfig } = require('vite');
const path = require('path');

module.exports = defineConfig({
  root: path.resolve(__dirname, 'client'),
  build: {
    outDir: path.resolve(__dirname, 'dist/public'),
    emptyOutDir: true,
    minify: false
  },
  esbuild: {
    jsx: 'automatic'
  }
});