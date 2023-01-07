
<div align='center'>
  <img src='https://i.imgur.com/NBpsl5W.png' alt='Discord Arts Banner' />
  <p align='center'>
  <a href='https://www.npmjs.com/package/discord-arts'>
    <img src='https://img.shields.io/npm/v/discord-arts?label=version&style=for-the-badge' alt='version' />
    <img src='https://img.shields.io/bundlephobia/min/discord-arts?label=size&style=for-the-badge' alt='size' />
    <img src='https://img.shields.io/npm/dt/discord-arts?style=for-the-badge' alt='downloads' />
  </a>
</p>
</div>

<p align="center">
  <strong>Image generation tools for Discord.JS v13 and v14</strong>
</p>

***

# 📦 Features

## 🤖 `profileImage(userId, imgOptions)`

*Generates the card of a user/bot, with its badges.*

PARAMETER | TYPE | REQUIRED | DESCRIPTION 
-------- | --------- | -------- | -------- 
userId| `string` | `✔️✔️✔️` | Discord User ID
imgOptions| `object` | `✖️✖️✖️` | Customize the card in multiple ways

### imgOptions `🔴NEW!!`
PARAMETER | TYPE | DEFAULT | DESCRIPTION 
-------- | --------- | -------- | -------- 
customTag| `string` | `✖️` | Text below the user
customBadges| `string[]` | `✖️` | Your own png badges `path and URL`
customBackground| `string` | `✖️` | Change the background to any image `path and URL`
overwriteBadges| `boolean` | `false` | Merge your badges with the discord defaults
usernameColor| `string` | `✖️` | Username HEX color
tagColor| `string` | `✖️` | Tag HEX color
borderColor| `string or string[]` | `✖️` | Border HEX color, can be gradient if 2 colors are used
borderAllign| `string` | `horizontal` | Gradient alignment if 2 colors are used
presenceStatus| `string` | `✖️` | User status to be displayed below the avatar
squareAvatar| `boolean` | `false` | Change avatar shape to a square

#### Returns: **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<**[Buffer](https://nodejs.org/api/buffer.html)**>**

***

### 📃 Discord.js v14 Example

```javascript
const { AttachmentBuilder } = require('discord.js');
const { profileImage } = require('discord-arts');

await interaction.deferReply();

const user = interaction.options.getUser('user-option');
const buffer = await profileImage(user.id); // <<<<<<
const attachment = new AttachmentBuilder(buffer, { name: 'profile.png' });

interaction.followUp({ files: [attachment] });
```

***

### 🖼️Example Results 

> ```javascript
> profileImage('ID')
> ```
> ![Default](https://i.imgur.com/Iu5E2Kf.png)

***

> ```javascript
> profileImage('ID', {
> 	customTag: 'Programmer',
> 	customBadges: [  './skull.png', './letter.png', './rocket.png', './crown.png', './hearth.png'  ],
> 	customBackground: 'https://i.imgur.com/Zm06vsb.png',
> 	overwriteBadges: true,
> 	borderColor: ['#841821', '#015b58'],
> 	presenceStatus: 'dnd'
> });
> ```
> ![Default](https://i.imgur.com/14AuGJ7.png)

***

> ```javascript
> profileImage('ID', {
> 	customTag: 'Minecraft Modder',
> 	customBadges: [ './badges/booster.png','./badges/orange.png', './badges/giveaway.png' ],
> 	overwriteBadges: false,
>   usernameColor: '#d9dfef',
> 	borderColor: ['#f90257', '#043a92'],
> 	presenceStatus: 'idle'
>   squareAvatar: true,
> });
> ```
> ![Default](https://i.imgur.com/YCTJ3xe.png)

***

> ```javascript
> profileImage('ID', {
> 	customTag: 'Minecraft Bot',
> 	customBackground: './imgs/axoBackground.png',
>   usernameColor: '#ffbddf',
>   borderColor: '#fe6a90',
> 	presenceStatus: 'online'
>   squareAvatar: true,
> });
> ```
> ![Default](https://i.imgur.com/yRzIo2R.png)

***

> # 💥 Issues / Feedback
> 
> ### Any problem or feedback, open an issue in our github repository [here](https://github.com/iAsure/discord-arts)


> # ⭐ Support
>
> ### Send me a msg on discord! [iAsure#0001](https://discord.com/users/339919990947971105)

