import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index'),
      name: 'telestore-sdk',
      formats: ['cjs'],
      fileName: `telestore_sdk`,
    },
    rollupOptions: {
      external: ['fs', 'path'],
      output: {
        globals: {},
      },
    },
    target: 'node18'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    dts({
      // @ts-ignore
      outputDir: 'dist/types',
      include: [
        'src/index.ts',
        'src/model/index.ts'
      ],
      rollupTypes: true
    })
  ]
});
