const DiscordArtsError = require("./error.utils");
const BASE_URL = "https://discord-arts.asure.dev/v1/user";
const fetch = require("node-fetch").default;
const fs = require("fs");
const { FetchError } = require("node-fetch");
const path = require("path");

async function fetchUserData(userId) {
  const packageJsonPath = path.join(__dirname, "..", "..", "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const version = packageJson.version;

  const errorInfo = { userId };

  try {
    const response = await fetch(`${BASE_URL}/${userId}`, {
      headers: {
        "x-darts-version": version,
      },
    });

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      if (contentType?.includes("text/html")) {
        throw new DiscordArtsError(
          "API is currently down, try again later",
          errorInfo
        );
      } else {
        throw new DiscordArtsError(
          "Invalid response format. Expected JSON, but received: " +
            contentType,
          errorInfo
        );
      }
    }

    const json = await response.json();
    if (json.error || !response.ok) {
      throw new DiscordArtsError(json?.message, errorInfo);
    }

    return json.data;
  } catch (error) {
    if (error instanceof FetchError) {
      throw new DiscordArtsError(
        "API is currently down, try again later",
        errorInfo
      );
    } else {
      throw new DiscordArtsError(
        error?.message || "API is currently down, try again later",
        errorInfo
      );
    }
  }
}

module.exports = fetchUserData;
