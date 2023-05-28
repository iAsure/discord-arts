/**
 * Parse Numbers To Strings
 * @param {number} exp
 * @returns {string}
 */
module.exports.numbersToStd = (exp) => {
  let final = Number(exp);

  if (final == NaN) {final = 0;}

  const Quad = 1e15;
  const Trillion = 1e12;
  const Billion = 1e9;
  const Million = 1e6;

  if (final > Quad) {
    final = `${(final / Quad).toFixed(2)}Q`;
  } else if (final > Trillion) {
    final = `${(final / Trillion).toFixed(2)}T`;
  } else if (final > Billion) {
    final = `${(final / Billion).toFixed(2)}B`;
  } else if (final > Million) {
    final = `${(final / Million).toFixed(2)}M`;
  } else if (final > 1000) {
    final = `${(final / 1000).toFixed(2)}k`;
  }

  return String(final);
};
