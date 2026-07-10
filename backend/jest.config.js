export default {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.(ts|js)$': ['ts-jest', {
      useESM: true,
      tsconfig: {
        isolatedModules: true,
        esModuleInterop: true,
      },
      diagnostics: {
        ignoreCodes: [151002],
      },
    }],
  },
  extensionsToTreatAsEsm: ['.ts'],
  setupFiles: ['<rootDir>/tests/helpers/env.cjs'],
  globalSetup: '<rootDir>/tests/helpers/globalSetup.ts',
  globalTeardown: '<rootDir>/tests/helpers/globalTeardown.ts',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: { branches: 14, functions: 22, lines: 26, statements: 25 },
    './src/routes/': { branches: 90, functions: 90, lines: 90, statements: 90 },
    './src/middlewares/': { branches: 65, functions: 65, lines: 65, statements: 65 },
    './src/queue/': { branches: 30, functions: 55, lines: 55, statements: 55 },
    './src/jobs/': { branches: 0, functions: 55, lines: 40, statements: 40 },
    './src/config/': { branches: 70, functions: 30, lines: 35, statements: 35 },
  },
  testTimeout: 30000,
  maxWorkers: 4,
};
