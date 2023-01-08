const { parsePng } = require('./parseData');

function parseUsername(username, ctx, font, size, maxLength) {
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
      if(newSize > 60) newSize -= 1;
      else usernameChars.pop();
    }

    if (actualLength <= maxLength) {
      finalUsername = usernameChars.join('');
      textLength = actualLength;
      finalized = true;
    }
  }

  return {
    username: textLength > maxLength ? finalUsername + '...' : finalUsername || '?????',
    newSize,
    textLength,
  };
}

async function addBadges(arrayBadges, read){

  const badges = []

  for (let i = 0; i < arrayBadges.length; i++) {
    const badgeJimp = await read(parsePng(arrayBadges[i]));
    badgeJimp.resize(46, 46);
    badges.push({ jimp: badgeJimp, x: 10, y: 23 });
  }

  return badges

}

module.exports = { parseUsername, addBadges }
