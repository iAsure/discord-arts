const { createCanvas, loadImage } = require('@napi-rs/canvas');

const {
  otherImgs,
  statusImgs,
} = require('../../public/profile-image.files.json');

// const badgesOrder = require('../config/badges-order.json');
const {
  parseUsername,
  abbreviateNumber,
  getDateOrString,
} = require('../utils/strings.utils');
const {
  parseImg,
  parseHex,
  parsePng,
  isString,
  isNumber,
} = require('../utils/validations.utils');
const DiscordArtsError = require('./error.utils');

const alphaValue = 0.4;
const clydeID = '1081004946872352958';

async function getBadges(data, options) {
  const { assets } = data;

  const badges = assets?.badges || [];
  const canvasBadges = [];

  for (const badge of badges.reverse()) {
    const { icon } = badge;
    const canvas = await loadImage(icon);

    canvasBadges.push({ canvas, x: 0, y: 15, w: 60 });
  }

  if (options?.customBadges?.length) {
    if (options?.overwriteBadges) {
      canvasBadges.splice(0, badges.length);
    }

    for (let i = 0; i < options.customBadges.length; i++) {
      const canvas = await loadImage(parsePng(options.customBadges[i]));
      canvasBadges.push({ canvas, x: 10, y: 22, w: 46 });
    }
  }

  return canvasBadges;
}

async function genBase(options, avatarData, bannerData) {
  const canvas = createCanvas(885, 303);
  const ctx = canvas.getContext('2d');

  let isBannerLoaded = true;
  let cardBackground = await loadImage(
    options?.customBackground
      ? parseImg(options.customBackground)
      : bannerData ?? avatarData
  ).catch(() => {});

  if (!cardBackground) {
    cardBackground = await loadImage(avatarData);
    isBannerLoaded = false;
  }

  const condAvatar = options?.customBackground
    ? true
    : !isBannerLoaded
    ? false
    : bannerData !== null;
  const wX = condAvatar ? 885 : 900;
  const wY = condAvatar ? 303 : wX;
  const cY = condAvatar ? 0 : -345;

  ctx.fillStyle = '#18191c';
  ctx.beginPath();
  ctx.fillRect(0, 0, 885, 303);
  ctx.fill();

  ctx.filter =
    (options?.moreBackgroundBlur
      ? 'blur(9px)'
      : options?.disableBackgroundBlur
      ? 'blur(0px)'
      : 'blur(3px)') +
    (options?.backgroundBrightness
      ? ` brightness(${options.backgroundBrightness + 100}%)`
      : '');
  ctx.drawImage(cardBackground, 0, cY, wX, wY);

  ctx.globalAlpha = 0.2;
  ctx.fillStyle = '#2a2d33';
  ctx.beginPath();
  ctx.fillRect(0, 0, 885, 303);
  ctx.fill();

  return canvas;
}

async function genFrame(badges, options) {
  const canvas = createCanvas(885, 303);
  const ctx = canvas.getContext('2d');

  const cardFrame = await loadImage(Buffer.from(otherImgs.frame, 'base64'));

  ctx.globalCompositeOperation = 'source-out';
  ctx.globalAlpha = 0.5;
  ctx.drawImage(cardFrame, 0, 0, 885, 303);
  ctx.globalCompositeOperation = 'source-over';

  ctx.globalAlpha = alphaValue;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.roundRect(696, 248, 165, 33, [12]);
  ctx.fill();
  ctx.globalAlpha = 1;

  const badgesLength = badges.length;

  if (options?.badgesFrame && badgesLength > 0 && !options?.removeBadges) {
    ctx.fillStyle = '#000';
    ctx.globalAlpha = alphaValue;
    ctx.beginPath();
    ctx.roundRect(857 - badgesLength * 59, 15, 59 * badgesLength + 8, 61, [17]);
    ctx.fill();
  }

  return canvas;
}

async function genBorder(options) {
  const canvas = createCanvas(885, 303);
  const ctx = canvas.getContext('2d');

  const borderColors = [];
  if (typeof options.borderColor == 'string')
    borderColors.push(options.borderColor);
  else borderColors.push(...options.borderColor);

  if (borderColors.length > 2)
    throw new DiscordArtsError(
      `Invalid borderColor length (${borderColors.length}) must be a maximum of 2 colors`
    );

  const gradX = options.borderAllign == 'vertical' ? 0 : 885;
  const gradY = options.borderAllign == 'vertical' ? 303 : 0;

  const grd = ctx.createLinearGradient(0, 0, gradX, gradY);

  for (let i = 0; i < borderColors.length; i++) {
    grd.addColorStop(i, parseHex(borderColors[i]));
  }

  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.fillRect(0, 0, 885, 303);

  ctx.globalCompositeOperation = 'destination-out';

  ctx.beginPath();
  ctx.roundRect(9, 9, 867, 285, [25]);
  ctx.fill();

  return canvas;
}

async function genTextAndAvatar(data, options, avatarData) {
  const { basicInfo } = data;
  const {
    globalName,
    username: rawUsername,
    discriminator,
    bot,
    createdTimestamp,
    id,
  } = basicInfo;

  const isClyde = id === clydeID;
  const pixelLength = bot ? 470 : 555;

  let canvas = createCanvas(885, 303);
  const ctx = canvas.getContext('2d');

  const fixedUsername = globalName || rawUsername;

  const { username, newSize } = parseUsername(
    fixedUsername,
    ctx,
    'Helvetica Bold',
    '80',
    pixelLength
  );

  const createdDateString = getDateOrString(
    options?.customDate,
    createdTimestamp,
    options?.localDateType
  );

  if (isClyde && !options?.customTag) {
    options.customTag = '@clyde';
  }

  const tag = options?.customTag
    ? isString(options.customTag, 'customTag')
    : !discriminator
    ? `@${rawUsername}`
    : `#${discriminator}`;

  ctx.font = `${newSize}px Helvetica Bold`;
  ctx.textAlign = 'left';
  ctx.fillStyle = options?.usernameColor
    ? parseHex(options.usernameColor)
    : '#FFFFFF';
  ctx.fillText(username, 300, 155);

  if (!options?.rankData) {
    ctx.font = '60px Helvetica';
    ctx.fillStyle = options?.tagColor ? parseHex(options.tagColor) : '#dadada';
    ctx.fillText(tag, 300, 215);
  }

  ctx.font = '23px Helvetica';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#dadada';
  ctx.fillText(createdDateString, 775, 273);

  const cardAvatar = await loadImage(avatarData);

  const roundValue = options?.squareAvatar ? 30 : 225;

  ctx.beginPath();
  ctx.roundRect(47, 39, 225, 225, [roundValue]);
  ctx.clip();

  ctx.fillStyle = '#292b2f';
  ctx.beginPath();
  ctx.roundRect(47, 39, 225, 225, [roundValue]);
  ctx.fill();

  ctx.drawImage(cardAvatar, 47, 39, 225, 225);

  ctx.closePath();

  if (options?.presenceStatus) {
    canvas = await genStatus(canvas, options);
  }

  return canvas;
}

async function genAvatarFrame(data, options) {
  let canvas = createCanvas(885, 303);
  const ctx = canvas.getContext('2d');

  const frameUrl = data?.decoration?.avatarFrame;

  const avatarFrame = await loadImage(frameUrl);
  ctx.drawImage(avatarFrame, 25, 18, 269, 269);

  if (options?.presenceStatus) {
    canvas = await cutAvatarStatus(canvas, options);
  }

  return canvas;
}

async function cutAvatarStatus(canvasToEdit, options) {
  const canvas = createCanvas(885, 303);
  const ctx = canvas.getContext('2d');

  const cX = options.presenceStatus == 'phone' ? 224.5 : 212;
  const cY = options.presenceStatus == 'phone' ? 202 : 204;

  ctx.drawImage(canvasToEdit, 0, 0);

  ctx.globalCompositeOperation = 'destination-out';

  if (options.presenceStatus == 'phone')
    ctx.roundRect(cX - 8, cY - 8, 57, 78, [10]);
  else ctx.roundRect(212, 204, 62, 62, [62]);
  ctx.fill();

  ctx.globalCompositeOperation = 'source-over';

  return canvas;
}

async function genStatus(canvasToEdit, options) {
  let canvas = createCanvas(885, 303);
  const ctx = canvas.getContext('2d');

  const validStatus = [
    'idle',
    'dnd',
    'online',
    'invisible',
    'offline',
    'streaming',
    'phone',
  ];

  if (!validStatus.includes(options.presenceStatus))
    throw new DiscordArtsError(
      `Invalid presenceStatus ('${options.presenceStatus}') must be 'online' | 'idle' | 'offline' | 'dnd' | 'invisible' | 'streaming' | 'phone'`
    );

  const statusString =
    options.presenceStatus == 'offline' ? 'invisible' : options.presenceStatus;

  const status = await loadImage(
    Buffer.from(statusImgs[statusString], 'base64')
  );

  const cX = options.presenceStatus == 'phone' ? 224.5 : 212;
  const cY = options.presenceStatus == 'phone' ? 202 : 204;

  ctx.drawImage(canvasToEdit, 0, 0);

  ctx.globalCompositeOperation = 'destination-out';

  if (options.presenceStatus == 'phone')
    ctx.roundRect(cX - 8, cY - 8, 57, 78, [10]);
  else ctx.roundRect(212, 204, 62, 62, [62]);
  ctx.fill();

  ctx.globalCompositeOperation = 'source-over';

  ctx.drawImage(status, cX, cY);

  return canvas;
}

async function genBadges(badges) {
  const canvas = createCanvas(885, 303);
  const ctx = canvas.getContext('2d');

  let x = 800;
  badges.forEach(async (badge) => {
    const { canvas, x: bX, y, w } = badge;
    ctx.drawImage(canvas, x + bX, y, w, w);
    x -= 59;
  });

  return canvas;
}

async function genBotVerifBadge(data) {
  const { basicInfo } = data;
  const { username, globalName, id } = basicInfo;

  const canvas = createCanvas(885, 303);
  const ctx = canvas.getContext('2d');

  const isClyde = id === clydeID;

  const usernameToParse = isClyde ? globalName : username;

  const { textLength } = parseUsername(
    usernameToParse,
    ctx,
    'Helvetica Bold',
    '80',
    470
  );

  const badgeName = isClyde
    ? 'botAI'
    : basicInfo?.verified
    ? 'botVerif'
    : 'botNoVerif';

  const botBadgeBase64 = otherImgs[badgeName];
  const botBagde = await loadImage(Buffer.from(botBadgeBase64, 'base64'));

  ctx.drawImage(botBagde, textLength + 310, 110);

  return canvas;
}

function genXpBar(options) {
  const {
    currentXp,
    requiredXp,
    level,
    rank,
    barColor,
    levelColor,
    autoColorRank,
  } = options.rankData;

  if (isNaN(currentXp) || isNaN(requiredXp) || isNaN(level)) {
    throw new DiscordArtsError(
      'rankData options requires: currentXp, requiredXp and level properties'
    );
  }

  const canvas = createCanvas(885, 303);
  const ctx = canvas.getContext('2d');

  const mY = 8;

  ctx.fillStyle = '#000';
  ctx.globalAlpha = alphaValue;
  ctx.beginPath();
  ctx.roundRect(304, 248, 380, 33, [12]);
  ctx.fill();
  ctx.globalAlpha = 1;

  const rankString = !isNaN(rank)
    ? `RANK #${abbreviateNumber(isNumber(rank, 'rankData:rank'))}`
    : '';
  const lvlString = !isNaN(level)
    ? `Lvl ${abbreviateNumber(isNumber(level, 'rankData:level'))}`
    : '';

  ctx.font = '21px Helvetica';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#dadada';
  ctx.fillText(
    `${abbreviateNumber(currentXp)} / ${abbreviateNumber(requiredXp)} XP`,
    314,
    273
  );

  const rankColors = {
    gold: '#F1C40F',
    silver: '#a1a4c9',
    bronze: '#AD8A56',
    current: '#dadada',
  };

  const rankMapping = {
    'RANK #1': rankColors.gold,
    'RANK #2': rankColors.silver,
    'RANK #3': rankColors.bronze,
  };

  if (autoColorRank && rankMapping.hasOwnProperty(rankString)) {
    rankColors.current = rankMapping[rankString];
  }

  ctx.font = 'bold 21px Helvetica';
  ctx.textAlign = 'right';
  ctx.fillStyle = rankColors.current;
  ctx.fillText(
    `${rankString}`,
    674 - ctx.measureText(lvlString).width - 10,
    273
  );

  ctx.font = 'bold 21px Helvetica';
  ctx.textAlign = 'right';
  ctx.fillStyle = levelColor ? parseHex(levelColor) : '#dadada';
  ctx.fillText(`${lvlString}`, 674, 273);

  ctx.globalAlpha = alphaValue;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.roundRect(304, 187 - mY, 557, 36, [14]);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.beginPath();
  ctx.roundRect(304, 187 - mY, 557, 36, [14]);
  ctx.clip();

  ctx.fillStyle = barColor ? parseHex(barColor) : '#fff';
  ctx.beginPath();
  ctx.roundRect(304, 187 - mY, Math.round((currentXp * 557) / requiredXp), 36, [
    14,
  ]);
  ctx.fill();

  return canvas;
}

function addShadow(canvasToEdit) {
  const canvas = createCanvas(885, 303);
  const ctx = canvas.getContext('2d');
  ctx.filter = 'drop-shadow(0px 4px 4px #000)';
  ctx.globalAlpha = alphaValue;
  ctx.drawImage(canvasToEdit, 0, 0);

  return canvas;
}

module.exports = {
  getBadges,
  genBase,
  genFrame,
  genBorder,
  genTextAndAvatar,
  genAvatarFrame,
  genXpBar,
  genBadges,
  genBotVerifBadge,
  addShadow,
};
