import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';

const modulesDir = path.resolve(__dirname, 'src/js/modules');
const subdirs = ['foundation', 'ui', 'search', 'security', 'engine'];

// Vite plugin to resolve ./modules/xxx.js imports to subdirectories
function modulesResolver() {
  return {
    name: 'modules-resolver',
    resolveId(source, importer) {
      if (!importer || !source.startsWith('./modules/')) return null;
      const importerDir = path.dirname(importer);
      const fullPath = path.resolve(importerDir, source);
      if (fs.existsSync(fullPath) || fs.existsSync(fullPath + '.js')) return null;
      const fileName = path.basename(source, '.js');
      for (const sub of subdirs) {
        const candidate = path.join(modulesDir, sub, fileName + '.js');
        if (fs.existsSync(candidate)) return candidate;
      }
      return null;
    }
  };
}

export default defineConfig({
  plugins: [tailwindcss(), modulesResolver()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'esbuild',
    sourcemap: false
  },
  server: {
    port: 3000,
    open: false
  },
  preview: {
    port: 4173
  }
});
