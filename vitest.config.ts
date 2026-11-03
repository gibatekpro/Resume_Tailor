import { defineConfig } from 'vitest/config';

// Separate from vite.config.ts so tests don't start the dev server's HTTPS certificate setup.
export default defineConfig({
    test: {
        include: ['src/**/*.test.ts', 'server/**/*.test.ts', 'tests/**/*.test.ts'],
        environment: 'node',
    },
});
