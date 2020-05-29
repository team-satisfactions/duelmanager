module.exports = {
  moduleFileExtensions: ['vue', 'js', 'json'],
  testMatch: ['<rootDir>/tests/e2e/**/*.(js|jsx|ts|tsx)'],
  preset: 'jest-puppeteer',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  verbose: true,
  testTimeout: 30000
}
