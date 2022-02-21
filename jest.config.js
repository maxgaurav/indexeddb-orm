module.exports = {
    "roots": [
      "<rootDir>/test"
    ],
    "testMatch": [
      "**/__tests__/**/*.+(ts|tsx|js)",
      "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    "transform": {
      "^.+\\.(ts|tsx)$": "ts-jest"
    },
    // "globalSetup": "<rootDir>/test/setupJest.ts",
    preset: 'jest-puppeteer',
    // setupFilesAfterEnv: "<rootDir>/test/setupJest.ts",
  }