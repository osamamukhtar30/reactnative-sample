import {MATCH_FEE_PERCENT, MATCH_FEE_PERCENT_PRO, DIVIDEND_FEE_PERCENT} from '@duelme/js-constants/dist/matches';

export const calculateProfit = ({betAmount, isPro}) => {
  return betAmount * 2 - betAmount * 2 * ((isPro ? MATCH_FEE_PERCENT_PRO : MATCH_FEE_PERCENT) + DIVIDEND_FEE_PERCENT);
};
