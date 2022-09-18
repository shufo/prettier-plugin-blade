/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

const ENABLE_COVERAGE = !!process.env.CI;

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/?(*.)+(spec|test).[jt]s?(x)'],
  verbose: true,
  cache: false,
  collectCoverage: ENABLE_COVERAGE,
};
