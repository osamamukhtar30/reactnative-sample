import {capitalize} from './strings';

describe('capitalize', () => {
  it('returns capitalized string from lowercase string', () => {
    const expectedResult = 'This is a custom string';
    const result = capitalize('this is a custom string');
    expect(result).toEqual(expectedResult);
  });
  it('returns capitalized string from uppercase string', () => {
    const expectedResult = 'This is a custom string';
    const result = capitalize('THIS IS A CUSTOM STRING');
    expect(result).toEqual(expectedResult);
  });
  it('returns capitalized string from capitalized string', () => {
    const expectedResult = 'This is a custom string';
    const result = capitalize('This is a custom string');
    expect(result).toEqual(expectedResult);
  });
});
