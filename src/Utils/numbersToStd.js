/**
 * Parse Numbers To Strings
 * @param {number} exp 
 * @returns {string}
 */
module.exports.numbersToStd = (exp) => {
    let final = exp;

    const Billion = 1e+9;
    const Million = 1e+6;

    if (final > Billion) {
        final = `${(final / Billion).toFixed(2)}B`;
    } else if (final > Million) {
        final = `${(final / Million).toFixed(2)}M`;
    } else if (final > 1000) {
        final = `${(final / 1000).toFixed(2)}k`;
    }

    return String(final);
}