import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/backend/__tests__", "<rootDir>/frontend/__tests__"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  testPathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/.next/", "<rootDir>/node_modules/"],
  moduleNameMapper: {
    "^@agi/(.*)$": "<rootDir>/backend/ai/agi/$1",
    "^@components/(.*)$": "<rootDir>/frontend/components/$1",
    "^@pages/(.*)$": "<rootDir>/frontend/pages/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/frontend/**/*.{ts,tsx}",
    "<rootDir>/backend/**/*.{ts,js}",
    "!<rootDir>/node_modules/",
    "!<rootDir>/dist/",
    "!<rootDir>/.next/",
  ],
  coverageDirectory: "<rootDir>/coverage",
  coverageReporters: ["json", "lcov", "text", "clover"],
};

export default config;
