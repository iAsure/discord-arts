const fetch = require('node-fetch').default;

const { genPng } = require('../utils/profile-image.output.utils');

async function profileImage(user, options) {
  if (!options) options = {};
  if (!user || typeof user !== 'string')
    throw new Error(
      "Discord Arts | You must add a parameter of String type (UserID)\n\n>> profileImage('USER ID')"
    );

  let data;

  try {
    // Private and exclusive Discord-Arts API
    const userData = await fetch(`https://discord-arts.asure.dev/user/${user}`);
    const json = await userData.json();
    data = json.data;

    if (data.statusCode) {
      throw new Error(`Discord Arts | ${data.message}`);
    }
  } catch (error) {
    throw new Error(`Discord Arts | Error fetching user data (${user})`);
  }

  return genPng(data, options);
}

module.exports = profileImage;
