const { read, AUTO, MIME_PNG, BLEND_MULTIPLY } = require("jimp");
const { createCanvas, registerFont } = require("canvas");
const fetch = require("node-fetch");
const moment = require("moment");
const {
  otherImgs,
  otherBadges,
  nitroBadges,
} = require("../../src/Images/profileImage.json");
const { fixString, lengthString } = require("../Utils/fixString");

registerFont(
  `${process.cwd()}/node_modules/discord-arts/src/Fonts/Helvetica.ttf`,
  {
    family: `Helvetica Normal`,
  }
);
registerFont(
  `${process.cwd()}/node_modules/discord-arts/src/Fonts/Helvetica-Bold.ttf`,
  {
    family: `Helvetica Bold`,
  }
);

async function profileImage(user) {
  if (!user || typeof user !== "string")
    throw new Error(
      'Discord Arts | You must add a parameter of String type (UserID)\n\n>> profileImage("USER ID")'
    );

  const userRegex = new RegExp(/^([0-9]{17,20})$/);
  if (!userRegex.test(user)) throw new Error("Discord Arts | Invalid User ID");

  const userData = await fetch(`https://japi.rest/discord/v1/user/${user}`);
  const { data } = await userData.json();

  let userName = data.username.replace(/[^\u0000-\u04FF]+/gm, "");

  const pixelLength = data.bot ? 420 : 515;

  const canvas = createCanvas(885, 303);
  const ctx = canvas.getContext("2d");

  const userMedida = lengthString(userName, ctx, "Helvetica Bold", "80");
  const userFix = fixString(userName, ctx, "Helvetica Bold", "80", pixelLength);

  const finalUser =
    userMedida > pixelLength ? userFix + "..." : userName ? userName : "?????";

  ctx.font = "80px Helvetica Bold";
  ctx.textAlign = "left";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(finalUser, 300, 155);

  const userPxWidth = ctx.measureText(finalUser).width;

  ctx.font = "60px Helvetica Normal";
  ctx.fillStyle = "#c7c7c7";
  ctx.fillText(`#${data.discriminator}`, 300, 215);

  ctx.font = "23px Helvetica Normal";
  ctx.textAlign = "center";
  ctx.fillText(
    `${moment(+data.createdTimestamp).format("MMM DD, YYYY")}`,
    775,
    273
  );

  const canvasJimp = await read(canvas.toBuffer());
  const base = await read(Buffer.from(otherImgs.UserBase, "base64"));
  const capa = await read(Buffer.from(otherImgs.UserProfile, "base64"));
  const mask = await read(Buffer.from(otherImgs.mask, "base64"));
  const mark = await read(Buffer.from(otherImgs.mark, "base64"));

  const avatarURL = data.avatarURL
    ? data.avatarURL + "?size=512"
    : data.defaultAvatarURL;

  const avatarBackground = await read(
    data.bannerURL ? data.bannerURL : avatarURL
  );
  const avatarProfile = await read(avatarURL);
  const avatarBlack = await read(Buffer.from(otherImgs.avatarBlack, "base64"));

  const condAvatar = data.bannerURL !== null;
  const avatarX = condAvatar ? 885 : 900;
  const avatarY = condAvatar ? 303 : AUTO;
  const avatarComp = condAvatar ? 0 : -345;

  avatarBackground.resize(avatarX, avatarY).opaque().blur(4);
  base.composite(avatarBackground, 0, avatarComp);

  canvasJimp.shadow({ size: 1, opacity: 0.3, y: 3, x: 0, blur: 2 });
  capa.opacity(0.8);
  base.composite(capa, 0, 0).composite(canvasJimp, 0, 0);

  avatarProfile.resize(225, 225).circle();

  avatarBlack
    .circle()
    .shadow({ size: 1, opacity: 0.3, y: 3, x: 0, blur: 2 })
    .composite(avatarProfile, 0, 0);

  base.composite(avatarBlack, 47, 39);

  mark.opacity(0.5);
  base.composite(mark, 0, 0, { mode: BLEND_MULTIPLY }).mask(mask);

  let badges = [],
    flagsUser = data.public_flags_array;
  flagsUser = flagsUser.sort();

  if (flagsUser.includes("NITRO"))
    read(Buffer.from(otherBadges.NITRO, "base64")).then((b) => badges.push(b));

  let botBagde;

  if (!data.bot) {
    for (let i = 0; i < flagsUser.length; i++) {
      if (flagsUser[i].startsWith("BOOSTER")) {
        let badge = await read(
          Buffer.from(nitroBadges[flagsUser[i]], "base64")
        );
        badges.push(badge);
      } else {
        if (flagsUser[i].startsWith("NITRO")) continue;
        let badge = await read(
          Buffer.from(otherBadges[flagsUser[i]], "base64")
        );
        badges.push(badge);
      }
    }

    let x = 800;
    badges.forEach((badge) => {
      badge.shadow({ size: 1, opacity: 0.3, y: 3, x: 0, blur: 2 }).opacity(0.9);
      base.composite(badge, x, 15);
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

    if (flagsUser.includes("VERIFIED_BOT")) {
      botBagde = await read(Buffer.from(otherImgs.botVerif, "base64"));
    } else {
      botBagde = await read(Buffer.from(otherImgs.botNoVerif, "base64"));
    }

    if (arrayFlags.includes("APPLICATION_COMMAND_BADGE")) {
      const slashBadge = await read(
        Buffer.from(otherBadges.SLASHBOT, "base64")
      );
      slashBadge
        .shadow({ size: 1, opacity: 0.3, y: 3, x: 0, blur: 2 })
        .opacity(0.9);
      base.composite(slashBadge, 800, 15);
    }

    base.composite(botBagde, userPxWidth + 310, 110);
  }

  const buffer = await base.getBufferAsync(MIME_PNG);

  return buffer;
}

module.exports = profileImage;
