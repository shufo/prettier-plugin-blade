/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

const ENABLE_COVERAGE = !!process.env.CI;

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  cache: false,
  collectCoverage: ENABLE_COVERAGE,
};
