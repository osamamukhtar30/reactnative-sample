jest.useFakeTimers();
import moment from 'moment';

import {isCheckinActive} from './date';

describe('date utils', () => {
  it('returns true if tournament start date is 4 minutes before current time', async () => {
    // If the tournament started 4 minutes ago, then it's open now
    const expectedResult = true;
    const tournamentStartDate = moment().subtract(4, 'minutes').format();
    const isCheckinActiveResult = isCheckinActive(tournamentStartDate);
    expect(isCheckinActiveResult).toBe(expectedResult);
  });
  it('returns true if tournament start date is 4 minutes and 59 seconds before current time', async () => {
    // If the tournament started 4 minutes and 59 seconds ago, then it's open now
    const expectedResult = true;
    const tournamentStartDate = moment().subtract(4, 'minutes').subtract(59, 'seconds').format();
    const isCheckinActiveResult = isCheckinActive(tournamentStartDate);
    expect(isCheckinActiveResult).toBe(expectedResult);
  });
  it('returns false if tournament start date is 5 before current time', async () => {
    // If the tournament started 5 minutes ago, then it's closed now
    const expectedResult = false;
    const tournamentStartDate = moment().subtract(5, 'minutes').format();
    const isCheckinActiveResult = isCheckinActive(tournamentStartDate);
    expect(isCheckinActiveResult).toBe(expectedResult);
  });
});
