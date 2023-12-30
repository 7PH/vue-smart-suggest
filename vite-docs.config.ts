import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [vue()],
    build: {
        emptyOutDir: false,
        outDir: path.resolve(__dirname, 'docs'),
        target: 'es6',
    },
});
