/**
 * Parse Numbers To Strings
 * @param {number} exp
 * @returns {string}
 */
module.exports.numbersToStd = (exp) => {
  let final = Number(exp);

  if (final == NaN) {final = 0;}

  const Billion = 1e9;
  const Million = 1e6;

  if (final > Billion) {
    final = `${(final / Billion).toFixed(2)}B`;
  } else if (final > Million) {
    final = `${(final / Million).toFixed(2)}M`;
  } else if (final > 1000) {
    final = `${(final / 1000).toFixed(2)}k`;
  }

  return String(final);
};
