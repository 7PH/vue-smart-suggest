/// <reference types="vitest" />
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [vue()],
    test: {
        environment: 'jsdom',
        coverage: {
            reportsDirectory: 'docs/coverage',
            reporter: ['text', 'html'],
        },
    },
    resolve: {
        alias: {
            '@/': new URL('./src/', import.meta.url).pathname,
        },
    },
    build: {
        outDir: path.resolve(__dirname, 'lib'),
        target: 'es6',
        lib: {
            entry: path.resolve(__dirname, 'src/lib/index.ts'),
            name: 'SmartSuggest',
            formats: ['umd', 'es'],
            fileName: (format) => `vue-smart-suggest.${format}.js`,
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                exports: 'named',
                globals: {
                    vue: 'Vue',
                },
            },
        },
    },
});
