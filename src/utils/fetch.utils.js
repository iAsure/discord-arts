const DiscordArtsError = require('./error.utils');

// Private and exclusive Discord-Arts API
const BASE_URL = 'https://discord-arts.asure.dev/user';
const fetch = require('node-fetch').default;

async function fetchUserData(userId) {
  try {
    const response = await fetch(`${BASE_URL}/${userId}`);
    const json = await response.json();

    if (json.error) throw new Error(json.message);

    return json.data;
  } catch (error) {
    throw new DiscordArtsError(error.message || 'Error fetching user data');
  }
}

module.exports = fetchUserData;
