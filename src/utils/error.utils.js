class DiscordArtsError extends Error {
  constructor(message, info) {
    const { userId, packageVersion } = info;
    super(message);
    this.userId = userId;
  }
}

module.exports = DiscordArtsError;
