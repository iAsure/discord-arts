const DiscordArtsError = require('../utils/error.utils');
const fetchUserData = require('../utils/fetch.utils');
const { genPng } = require('../utils/profile-image.output.utils');

async function profileImage(userId, options) {
  if (!options) options = {};
  if (!userId || typeof userId !== 'string')
    throw new DiscordArtsError(
      "You must add a parameter of String type (UserID)\n\n>> profileImage('UserID')"
    );

  const data = await fetchUserData(userId);

  try {
    const buffer = await genPng(data, options);

    return buffer;
  } catch (error) {
    if (error.message.includes('source rejected')) {
      throw new DiscordArtsError(`Error loading user assets, try again later`, { userId })
    }
    throw new DiscordArtsError(error?.message, { userId })
  }
}

module.exports = profileImage;
