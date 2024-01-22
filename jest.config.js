module.exports = {
  preset: 'react-native',
  globals: {
    'ts-jest': {
      babelConfig: true,
    },
  },
  moduleNameMapper: {
    '^styled-components$': '<rootDir>/node_modules/styled-components',
  },
  setupFilesAfterEnv: ['./jest.setup.js', './node_modules/react-native-gesture-handler/jestSetup.js'],
  transformIgnorePatterns: [], // so was this
  coveragePathIgnorePatterns: ['<rootDir>/src/common/tests/mockServer'],
};
