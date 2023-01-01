
<div align="center">
  <img src="https://i.imgur.com/EPJEbzD.png" alt="Discord Arts Banner" />
  <p align="center">
  <a href="https://www.npmjs.com/package/discord-arts">
    <img src="https://img.shields.io/npm/v/discord-arts?label=version&style=for-the-badge" alt="version" />
    <img src="https://img.shields.io/bundlephobia/min/discord-arts?label=size&style=for-the-badge" alt="size" />
    <img src="https://img.shields.io/npm/dt/discord-arts?style=for-the-badge" alt="downloads" />
  </a>
</p>
</div>

# 📦 Features
## 🤖 `profileImage(userId)`

*Generates the card of a user/bot, with its badges.*

PARAMETER | TYPE | DESCRIPTION 
-------- | --------- | -------- 
userId| string | Discord User ID

Returns: [**Promise**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<**[Buffer](https://nodejs.org/api/buffer.html)**>

### 📃 Example
```javascript
const { AttachmentBuilder } = require("discord.js");
const { profileImage } = require("discord-arts");

const userId = interaction.options.getUser("user-option").id || interaction.user.id;
const bufferImg = await profileImage(userId);
const imgAttachment = new AttachmentBuilder(bufferImg, { name: "profile.png" });

interaction.reply({ files: [imgAttachment] });
```
### 🖼️Results 
![Common user without Nitro](https://i.imgur.com/2GplZVh.png)