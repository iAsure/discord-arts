function parseUsername(username, ctx, font, size, maxLength) {
  username = username && username.replace(/\s/g, '') ? username : '?????'
  let usernameChars = username.split('');
  let editableUsername = '';
  let finalUsername = '';

  let newSize = +size;
  let textLength;

  let finalized = false;

  while (!finalized) {
    editableUsername = usernameChars.join('');

    ctx.font = `${newSize}px ${font}`;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#FFFFFF';

    const actualLength = ctx.measureText(editableUsername).width;

    if (actualLength >= maxLength) {
      if (newSize > 60) newSize -= 1;
      else usernameChars.pop();
    }

    if (actualLength <= maxLength) {
      finalUsername = usernameChars.join('');
      textLength = actualLength;
      finalized = true;
    }
  }

  return {
    username: finalUsername,
    newSize,
    textLength,
  };
}

/**
 * This methods takes a large number like "9360" and converts it to a small decimal like "9.3".
 * Used by `abbreviateNumber()` to form abbreviations like "9.3K".
 *
 * At the moment, this method intentionally avoids number rounding, for simplicity.
 */
function getFirstDigitsAsDecimal(numString) {
  const digits = ((numString.length - 1) % 3) + 1;
  if (numString.length < 4) {
    return numString;
  }

  const decimal = numString.slice(digits, digits + 1);
  return `${numString.slice(0, digits)}${
    decimal == '0' || decimal == '00' || digits == 3
      ? ''
      : `.${decimal.replace(/0$/g, '')}`
  }`;
}

/**
 * Abbreviation follows format seen in many games:
 * K - thousands
 * M - millions
 * B - billions
 * T - trillions
 *
 * All larger numbers beyond trillions follow the following format, using every letter of the alphabet paired with itself:
 * AA
 * BB
 * ...
 * ZZ
 *
 * This supports all numbers nearly up to a googol (100 zeroes), supporting up to 92 zeroes or 93 digits.
 */
function abbreviateNumber(number) {
  const numString = `${number}`;
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const abbreviations = ['', 'K', 'M', 'B', 'T'].concat(
    new Array(letters.length).fill('AA').map((_, i) => letters[i].repeat(2))
  );

  const selectedAbbr =
    abbreviations[Math.floor((numString.length - 1) / 3)] ?? '??';
  return `${getFirstDigitsAsDecimal(numString)}${selectedAbbr}`;
}

const getDateOrString = (dateInput, createdTimestamp, localDateType = 'en') => {
  const dateOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

  if (typeof dateInput === 'string') {
    if (iso8601Regex.test(dateInput)) {
      const dateInstance = new Date(dateInput);
      return dateInstance.toLocaleDateString(localDateType, dateOptions);
    } else {
      return dateInput;
    }
  } else if (dateInput instanceof Date) {
    return dateInput.toLocaleDateString(localDateType, dateOptions);
  } else if (dateInput === undefined || dateInput === null) {
    return new Date(+createdTimestamp).toLocaleDateString(localDateType, dateOptions);
  }
};

module.exports = { parseUsername, abbreviateNumber, getDateOrString };
