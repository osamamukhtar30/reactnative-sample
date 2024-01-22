export const getIntegerOrdinal = function (d) {
  const dString = String(d);
  const last = parseInt(dString.slice(-2));
  if (last > 3 && last < 21) return 'th';
  switch (last % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};
