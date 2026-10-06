import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    // Testes de carreira simulam dezenas de carreiras; com a máquina carregada passam dos 5 s padrão.
    testTimeout: 30_000,
  },
});
