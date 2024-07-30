const DiscordArtsError = require('../utils/error.utils');
const fetchUserData = require('../utils/fetch.utils');
const { genPng } = require('../utils/profile-image.output.utils');

async function profileImage(userId, options) {
  if (!options) options = {};
  if (!userId || typeof userId !== 'string')
    throw new DiscordArtsError(
      `TypeError: Invalid argument for profileImage()\nExpected string userId, got ${typeof userId === 'undefined' || !userId ? 'undefined' : typeof userId}`
    );

  const data = await fetchUserData(userId);

  try {
    const buffer = await genPng(data, options);

    return buffer;
  } catch (error) {
    if (error.message.includes('source rejected')) {
      throw new DiscordArtsError(`Error loading user assets, try again later`)
    }
    throw new DiscordArtsError(error?.message)
  }
}

module.exports = profileImage;
