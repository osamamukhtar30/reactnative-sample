import {getIntegerOrdinal} from './numbers';

describe('Numbers utils', () => {
  describe('getIntegerOrdinal', () => {
    it('is st for 1', async () => {
      const expectedResult = 'st';
      const result = getIntegerOrdinal(1);
      expect(result).toEqual(expectedResult);
    });

    it('is nd for 2', async () => {
      const expectedResult = 'nd';
      const result = getIntegerOrdinal(2);
      expect(result).toEqual(expectedResult);
    });

    it('is rd for 3', async () => {
      const expectedResult = 'rd';
      const result = getIntegerOrdinal(3);
      expect(result).toEqual(expectedResult);
    });

    it('is th for 4', async () => {
      const expectedResult = 'th';
      const result = getIntegerOrdinal(4);
      expect(result).toEqual(expectedResult);
    });

    it('is th for 10', async () => {
      const expectedResult = 'th';
      const result = getIntegerOrdinal(10);
      expect(result).toEqual(expectedResult);
    });

    it('is th for 11', async () => {
      const expectedResult = 'th';
      const result = getIntegerOrdinal(11);
      expect(result).toEqual(expectedResult);
    });

    it('is th for 12', async () => {
      const expectedResult = 'th';
      const result = getIntegerOrdinal(12);
      expect(result).toEqual(expectedResult);
    });

    it('is th for 13', async () => {
      const expectedResult = 'th';
      const result = getIntegerOrdinal(13);
      expect(result).toEqual(expectedResult);
    });

    it('is th for 20', async () => {
      const expectedResult = 'th';
      const result = getIntegerOrdinal(20);
      expect(result).toEqual(expectedResult);
    });

    it('is st for 21', async () => {
      const expectedResult = 'st';
      const result = getIntegerOrdinal(21);
      expect(result).toEqual(expectedResult);
    });

    it('is nd for 22', async () => {
      const expectedResult = 'nd';
      const result = getIntegerOrdinal(22);
      expect(result).toEqual(expectedResult);
    });

    it('is rd for 23', async () => {
      const expectedResult = 'rd';
      const result = getIntegerOrdinal(23);
      expect(result).toEqual(expectedResult);
    });

    it('is th for 24', async () => {
      const expectedResult = 'th';
      const result = getIntegerOrdinal(24);
      expect(result).toEqual(expectedResult);
    });

    it('is th for 30', async () => {
      const expectedResult = 'th';
      const result = getIntegerOrdinal(30);
      expect(result).toEqual(expectedResult);
    });

    it('is st for 31', async () => {
      const expectedResult = 'st';
      const result = getIntegerOrdinal(31);
      expect(result).toEqual(expectedResult);
    });

    it('is nd for 32', async () => {
      const expectedResult = 'nd';
      const result = getIntegerOrdinal(32);
      expect(result).toEqual(expectedResult);
    });

    it('is rd for 33', async () => {
      const expectedResult = 'rd';
      const result = getIntegerOrdinal(33);
      expect(result).toEqual(expectedResult);
    });

    it('is th for 34', async () => {
      const expectedResult = 'th';
      const result = getIntegerOrdinal(34);
      expect(result).toEqual(expectedResult);
    });
  });
});
