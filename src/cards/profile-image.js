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

  return genPng(data, options);
}

module.exports = profileImage;
