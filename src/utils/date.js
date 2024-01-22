import moment from 'moment';

export const isCheckinActive = tournamentStartDate => {
  return moment().isBefore(moment(tournamentStartDate).add(5, 'minutes'));
};
