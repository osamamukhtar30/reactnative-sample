import {calculateProfit} from './calculationHelpers';

describe('Calculation helpers', () => {
  describe('calculateProfit', () => {
    it('calculates for non pro user', async () => {
      const expectedResult = 9.5;
      const result = calculateProfit({betAmount: 5});
      expect(result).toEqual(expectedResult);
    });

    it('calculates for pro user', async () => {
      const expectedResult = 9.75;
      const result = calculateProfit({betAmount: 5, isPro: true});
      expect(result).toEqual(expectedResult);
    });
  });
});
