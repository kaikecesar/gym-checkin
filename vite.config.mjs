import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    dir: 'src',
    projects: [
      {
        extends: true,
        test: {
          name: 'e2e',
          dir: 'src/cloud_apis/controllers',
          environment: `./prisma/vitest_environment/test_environment.ts`,
        },
      },
      {
        extends: true,
        test: {
          name: 'unit',
          dir: 'src/services',
        },
      },
    ],
  },
});
