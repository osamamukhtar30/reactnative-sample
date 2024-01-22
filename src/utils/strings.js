// I'd prefer to use the :first-letter selector but if looks like it does not work on react native
export const capitalize = str => {
  const result = str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  return result;
};
