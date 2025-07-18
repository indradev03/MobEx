// jest.config.js
export default {
  testEnvironment: 'node',
  transform: {}, // no transform needed for plain JS ESM
  testMatch: ['**/__tests__/**/*.test.js', '**/tests/**/*.test.js'],
  verbose: true
};
