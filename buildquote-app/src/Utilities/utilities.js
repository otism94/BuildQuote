/**
 * Rounds a number to two decimal places. Useful for calculating price information.
 * @param {number} num Number to round.
 * @returns The number rounded to two decimal places.
 */
export const roundToTwoDecimals = (num) =>
  Math.round((num + Number.EPSILON) * 100) / 100;
