export default {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js", "json"],
  moduleDirectories: ["node_modules", "src"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // Përputhje për aliaset
  },
  testMatch: [
    "**/__tests__/**/*.test.ts", // Testet në dosjen __tests__
    "**/?(*.)+(spec|test).ts", // Testet që përfundojnë me .spec.ts ose .test.ts
  ],
  collectCoverage: true, // Aktivizon mbledhjen e mbulimit të kodit
  coverageDirectory: "coverage", // Dosja ku ruhet raporti i mbulimit
  coverageReporters: ["json", "lcov", "text", "clover"], // Formate të raportit të mbulimit
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.json", // Sigurohet që Jest përdor tsconfig të projektit
    },
  },
};
