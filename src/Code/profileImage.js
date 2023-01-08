const { read, AUTO, MIME_PNG, BLEND_MULTIPLY } = require('jimp');
const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const fetch = require('node-fetch');
const moment = require('moment');
const path = require('path');

const {
  otherImgs,
  otherBadges,
  nitroBadges,
  statusImgs,
} = require('../../src/Images/profileImage.json');

const badgesOrder = require('../Utils/badgesOrder.json');
const { parseUsername, addBadges } = require('../Utils/imageUtils');
const { parseImg, parseHex, isString } = require('../Utils/parseData');

GlobalFonts.registerFromPath(
  `${path.join(__dirname, '..', 'Fonts')}/Helvetica.ttf`,
  `Helvetica`
);

async function profileImage(user, options) {
  if (!user || typeof user !== 'string')
    throw new Error(
      'Discord Arts | You must add a parameter of String type (UserID)\n\n>> profileImage(\'USER ID\')'
    );

  const userRegex = new RegExp(/^([0-9]{17,20})$/);
  if (!userRegex.test(user)) throw new Error('Discord Arts | Invalid User ID');

  const userData = await fetch(`https://japi.rest/discord/v1/user/${user}`);
  const { data } = await userData.json();
  const {
    username: rawUsername,
    discriminator,
    bot,
    createdTimestamp,
    avatarURL,
    defaultAvatarURL,
    bannerURL,
    public_flags_array,
  } = data;

  const pixelLength = bot ? 450 : 555;

  const canvas = createCanvas(885, 303);
  const ctx = canvas.getContext('2d');

  const { username, newSize, textLength } = parseUsername(rawUsername, ctx, 'Helvetica', '80', pixelLength);

  const tag = options?.customTag
    ? isString(options.customTag, 'customTag')
    : `#${discriminator}`;

  ctx.font = `${newSize}px Helvetica`;
  ctx.textAlign = 'left';
  ctx.fillStyle = options?.usernameColor
    ? parseHex(options.usernameColor)
    : '#FFFFFF';
  ctx.fillText(username, 300, 155);

  ctx.font = '60px Sans';
  ctx.fillStyle = options?.tagColor ? parseHex(options.tagColor) : '#c7c7c7';
  ctx.fillText(tag, 300, 215);

  ctx.font = ' 23px Sans';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#c7c7c7';
  ctx.fillText(`${moment(+createdTimestamp).format('MMM DD, YYYY')}`, 775, 273);

  const cardText = await read(canvas.toBuffer('image/png'));
  const cardBase = await read(Buffer.from(otherImgs.UserBase, 'base64'));
  const cardEdit = await read(Buffer.from(otherImgs.UserProfile, 'base64'));
  const cardMask = await read(Buffer.from(otherImgs.mask, 'base64'));
  const cardFrame = await read(Buffer.from(otherImgs.mark, 'base64'));
  const avSquareMask = await read(Buffer.from(otherImgs.squareMask, 'base64'));
  const avCircleMask = await read(Buffer.from(otherImgs.circleMask, 'base64'));

  const newAvatarURL = avatarURL ? avatarURL + '?size=512' : defaultAvatarURL;

  const cardBackground = await read(
    options?.customBackground
      ? parseImg(options.customBackground)
      : bannerURL
      ? bannerURL
      : newAvatarURL
  );
  const cardAvatar = await read(newAvatarURL);
  const avatarBackground = await read(Buffer.from(otherImgs.avatarBlack, 'base64'));

  const condAvatar = options?.customBackground ? true : bannerURL !== null;
  const avatarX = condAvatar ? 885 : 900;
  const avatarY = condAvatar ? 303 : AUTO;
  const avatarComp = condAvatar ? 0 : -345;

  cardBackground.resize(avatarX, avatarY).opaque().blur(4);
  cardBase.composite(cardBackground, 0, avatarComp);

  cardText.shadow({ size: 1, opacity: 0.3, y: 3, x: 0, blur: 2 });
  cardEdit.opacity(0.8);
  cardBase.composite(cardEdit, 0, 0).composite(cardText, 0, 0);

  cardAvatar.resize(225, 225);

  if (options?.presenceStatus) {
    const validStatus = ['idle', 'dnd', 'online', 'invisible'];

    if (!validStatus.includes(options.presenceStatus))
      throw new Error(
        `Discord Arts | Invalid presenceStatus (${options.presenceStatus}) must be 'idle | dnd | online | invisible'`
      );

    const status = await read(
      Buffer.from(statusImgs[options.presenceStatus], 'base64')
    );

    status.shadow({ size: 1, opacity: 0.3, y: 3, x: 0, blur: 2 });
    cardBase.composite(status, 0, 0);
  }

  avatarBackground.composite(cardAvatar, 47, 39);

  if (!options?.squareAvatar) avatarBackground.mask(avCircleMask);
  else avatarBackground.mask(avSquareMask);

  if (options?.presenceStatus) {
    const maskStatus = await read(Buffer.from(statusImgs.mask, 'base64'));
    avatarBackground.mask(maskStatus, 47, 39);
  }

  avatarBackground.shadow({ size: 1, opacity: 0.3, y: 3, x: 0, blur: 2 });

  cardBase.composite(avatarBackground, 0, 0);

  cardFrame.opacity(0.5);
  cardBase.composite(cardFrame, 0, 0, { mode: BLEND_MULTIPLY }).mask(cardMask);

  if (options?.borderColor) {
    const borderColors = [];
    if (typeof options.borderColor == 'string')
      borderColors.push(options.borderColor);
    else borderColors.push(...options.borderColor);

    if (borderColors.length > 2)
      throw new Error(
        `Discord Arts | Invalid borderColor length (${borderColors.length}) must be a maximum of 2 colors`
      );

    const canvas = createCanvas(885, 303);
    const ctx = canvas.getContext('2d');

    const gradX = options.borderAllign == 'vertical' ? 0 : 885;
    const gradY = options.borderAllign == 'vertical' ? 303 : 0;

    const grd = ctx.createLinearGradient(0, 0, gradX, gradY);

    for (let i = 0; i < borderColors.length; i++) {
      grd.addColorStop(i, parseHex(borderColors[i]));
    }

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 885, 303);

    const borderBuffer = await read(canvas.toBuffer('image/png'));
    const borderMask = await read(Buffer.from(otherImgs.borderMask, 'base64'));

    borderBuffer.mask(borderMask);

    cardBase.composite(borderBuffer, 0, 0);
  }

  let badges = [],
    flagsUser = public_flags_array;
  flagsUser = flagsUser.sort((a, b) => badgesOrder[b] - badgesOrder[a]);

  let botBagde;

  if (!bot) {
    for (let i = 0; i < flagsUser.length; i++) {
      if (flagsUser[i].startsWith('BOOSTER')) {
        let badge = await read(
          Buffer.from(nitroBadges[flagsUser[i]], 'base64')
        );
        badges.push({ jimp: badge, x: 0, y: 15 });
      } else if (flagsUser[i].startsWith('NITRO')) {
        let badge = await read(
          Buffer.from(otherBadges[flagsUser[i]], 'base64')
        );
        badges.push({ jimp: badge, x: 0, y: 15 });
      } else {
        if (flagsUser[i].startsWith('NITRO')) continue;

        let badge = await read(
          Buffer.from(otherBadges[flagsUser[i]], 'base64')
        );
        badges.push({ jimp: badge, x: 0, y: 15 });
      }
    }
  
    if (options?.customBadges?.length) {
      if (options?.overwriteBadges) {
        badges = [];
      };

      const newBadges = await addBadges(options.customBadges, read)
      badges.push(...newBadges)
    }

    let x = 800;
    badges.forEach((badge) => {
      badge.jimp
        .shadow({ size: 1, opacity: 0.3, y: 3, x: 0, blur: 2 })
        .opacity(0.9);
      cardBase.composite(badge.jimp, x + badge.x, badge.y);
      x -= 60;
    });
  } else {
    const botFetch = await fetch(
      `https://discord.com/api/v10/applications/${user}/rpc`
    );

    const json = await botFetch.json();
    let flagsBot = json.flags;

    const gateways = {
      APPLICATION_COMMAND_BADGE: 1 << 23,
    };

    const arrayFlags = [];
    for (let i in gateways) {
      const bit = gateways[i];
      if ((flagsBot & bit) === bit) arrayFlags.push(i);
    }

    if (flagsUser.includes('VERIFIED_BOT')) {
      botBagde = await read(Buffer.from(otherImgs.botVerif, 'base64'));
    } else {
      botBagde = await read(Buffer.from(otherImgs.botNoVerif, 'base64'));
    }

    if (arrayFlags.includes('APPLICATION_COMMAND_BADGE')) {
      const slashBadge = await read(
        Buffer.from(otherBadges.SLASHBOT, 'base64')
      );
      badges.push({ jimp: slashBadge, x: 0, y: 15 });
    }

    if (options?.customBadges?.length) {
      if (options?.overwriteBadges) {
        badges = [];
      };

      const newBadges = await addBadges(options.customBadges, read)
      badges.push(...newBadges)
    }

    let x = 800;
    badges.forEach((badge) => {
      badge.jimp
        .shadow({ size: 1, opacity: 0.3, y: 3, x: 0, blur: 2 })
        .opacity(0.9);
      cardBase.composite(badge.jimp, x + badge.x, badge.y);
      x -= 60;
    });

    cardBase.composite(botBagde, textLength + 310, 110);
  }

  const buffer = await cardBase.getBufferAsync(MIME_PNG);

  return buffer;
}

module.exports = profileImage;
