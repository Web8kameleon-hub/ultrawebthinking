export default {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": ["ts-jest"],
  },
  roots: ["<rootDir>/backend/__tests__", "<rootDir>/utils/__tests__"],
  moduleFileExtensions: ["ts", "js", "json"],
  testPathIgnorePatterns: [
    "<rootDir>/dist/",
    "<rootDir>/.*__tests__/dist/",
  ],
  collectCoverage: true,
  coverageDirectory: "<rootDir>/coverage",
  coverageReporters: ["json", "lcov", "text", "clover"],
};

