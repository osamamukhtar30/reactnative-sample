'use strict';

const responsiveScreens = jest.createMockFromModule('react-native-responsive-screen');

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.

// A custom version of `readdirSync` that reads from the special mocked out
// file list set via __setMockFiles

responsiveScreens.heightPercentageToDP = jest.fn(() => 1000);
responsiveScreens.widthPercentageToDP = jest.fn(() => 400);

module.exports = responsiveScreens;
