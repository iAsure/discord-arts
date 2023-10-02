const fetch = require('node-fetch').default;

const { genPng } = require('../utils/profile-image.output.utils')

async function profileImage(user, options) {
  if (!user || typeof user !== 'string')
    throw new Error(
      "Discord Arts | You must add a parameter of String type (UserID)\n\n>> profileImage('USER ID')"
    );

  const userRegex = new RegExp(/^([0-9]{17,20})$/);
  if (!userRegex.test(user)) throw new Error('Discord Arts | Invalid User ID');

  let data;

  try {
    const userData = await fetch(`https://japi.rest/discord/v1/user/${user}`);
    const json = await userData.json();
    data = json.data;
  } catch (error) {
    throw new Error(`Discord Arts | Error fetching user data (${user})`)
  }

  return genPng(data, options)
}

module.exports = profileImage;
