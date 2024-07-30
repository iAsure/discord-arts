const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const path = require('path');

const {
  getBadges,
  genBase,
  genFrame,
  genTextAndAvatar,
  genAvatarFrame,
  genBorder,
  genBadges,
  genBotVerifBadge,
  genXpBar,
  addShadow,
} = require('../utils/profile-image.utils');

GlobalFonts.registerFromPath(
  `${path.join(__dirname, '..', '..', 'public', 'fonts')}/HelveticaBold.ttf`,
  `Helvetica Bold`
);
GlobalFonts.registerFromPath(
  `${path.join(__dirname, '..', '..', 'public', 'fonts')}/Helvetica.ttf`,
  `Helvetica`
);

async function genPng(data, options) {
  const { basicInfo, assets } = data;
  const canvas = createCanvas(885, 303);
  const ctx = canvas.getContext('2d');

  const userAvatar = (assets.avatarURL ?? assets.defaultAvatarURL) + '?size=512';
  const userBanner = assets.bannerURL ? assets.bannerURL + '?size=512' : null;
  const badges = await getBadges(data, options);

  if (options?.removeBorder) ctx.roundRect(9, 9, 867, 285, [26]);
  else ctx.roundRect(0, 0, 885, 303, [34]);
  ctx.clip();

  const cardBase = await genBase(options, userAvatar, userBanner);
  ctx.drawImage(cardBase, 0, 0);

  const cardFrame = await genFrame(badges, options);
  ctx.drawImage(cardFrame, 0, 0);

  const cardTextAndAvatar = await genTextAndAvatar(data, options, userAvatar);
  const textAvatarShadow = addShadow(cardTextAndAvatar);
  ctx.drawImage(textAvatarShadow, 0, 0);
  ctx.drawImage(cardTextAndAvatar, 0, 0);

  if (
    !options?.disableProfileTheme &&
    data?.decoration?.profileColors &&
    typeof options?.borderColor === 'undefined'
  ) {
    options.borderColor = data?.decoration?.profileColors;
    if (!options?.borderAllign) {
      options.borderAllign = 'vertical';
    }
  }

  if (
    (typeof options?.borderColor === 'string' && options.borderColor) ||
    (Array.isArray(options?.borderColor) && options.borderColor.length > 0)
  ) {
    const border = await genBorder(options);
    ctx.drawImage(border, 0, 0);
  }

  if (basicInfo?.bot) {
    const botVerifBadge = await genBotVerifBadge(data);
    const shadowVerifBadge = addShadow(botVerifBadge);
    ctx.drawImage(shadowVerifBadge, 0, 0);
    ctx.drawImage(botVerifBadge, 0, 0);
  }

  if (!options?.removeBadges) {
    const cardBadges = await genBadges(badges);
    const badgesShadow = addShadow(cardBadges);
    ctx.drawImage(badgesShadow, 0, 0);
    ctx.drawImage(cardBadges, 0, 0);
  }

  if (options?.rankData) {
    const xpBar = genXpBar(options);
    ctx.drawImage(xpBar, 0, 0);
  }

  if (
    !options?.removeAvatarFrame &&
    data?.decoration?.avatarFrame
  ) {
    const avatarFrame = await genAvatarFrame(data, options);
    ctx.drawImage(avatarFrame, 0, 0);
  }

  return canvas.toBuffer('image/png');
}

module.exports = { genPng };
