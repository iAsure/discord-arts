function parseUsername(username, ctx, font, size, maxLength) {
  username = username.replace(/\s/g, '') ? username : '?????'
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
    username: finalUsername,
    newSize,
    textLength,
  };
}

module.exports = { parseUsername }
