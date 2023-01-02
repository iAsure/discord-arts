
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
userId| string | ✔️✔️✔️ | Discord User ID
imgOptions| object | ✖️✖️✖️ | Customize the card in multiple ways

### imgOptions `🔴NEW!!`
PARAMETER | TYPE | DEFAULT | DESCRIPTION 
-------- | --------- | -------- | -------- 
customTag| string | `✖️` | Text below the user
customBadges| string[] | `✖️` | Your own png badges `(path and URL)`
customBackground| string | `✖️` | Change the background to any image `(path and URL)`
overwriteBadges| boolean | `false` | Merge your badges with the discord defaults
borderColor| string[] | `✖️` | Hex color of the border, can be gradient if 2 colors are used
borderAllign| string | `horizontal` | Gradient alignment if 2 colors are used `(horizontal | vertical)`
presenceStatus| string | `✖️` | User status to be displayed below the avatar (`online | dnd | idle | invisible`)

#### Returns: **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<**[Buffer](https://nodejs.org/api/buffer.html)**>**

***

### 📃 Discord.js v14 Example
```javascript
const { AttachmentBuilder } = require('discord.js');
const { profileImage } = require('discord-arts');

await interaction.deferReply()

const user = interaction.options.getUser('user-option')
const bufferImg = await profileImage(user.id); // <<<<<<
const imgAttachment = new AttachmentBuilder(bufferImg, { name: 'profile.png' });

interaction.followUp({ files: [imgAttachment] });
```


***


### 🖼️Results 

```javascript
profileImage('ID')
```
![Default](https://i.imgur.com/HKumM3y.png)

***

```javascript
profileImage('ID', {
	customTag: 'Programmer',
	customBadges: [  './skull.png', './letter.png', './rocket.png', './crown.png', './hearth.png'  ],
	customBackground: 'https://i.imgur.com/DGA63O0.jpg',
	overwriteBadges: true,
	borderColor: ['#841821', '#005b58'],
	presenceStatus: 'dnd'
});
```
![Default](https://i.imgur.com/qkT2DRk.png)

***

```javascript
profileImage('ID', {
	customTag: 'Minecraft Modder',
	customBadges: [ './badges/booster.png','./badges/orange.png', './badges/giveaway.png' ],
	overwriteBadges: false,
	borderColor: ['#f90257', '#043a92'],
	presenceStatus: 'idle'
});
```
![Default](https://i.imgur.com/Tz4IgNH.png)

***

```javascript
profileImage('ID', {
	customTag: 'Minecraft Bot',
	customBackground: './imgs/axoBackground.png',
	borderColor: ['#fe6a90'],
	presenceStatus: 'online'
});
```
![Default](https://i.imgur.com/W8PVvOY.png)

***

> # 💥 Issues / Feedback
> 
>> ### Any problem or feedback, open an issue in our github repository [here](https://github.com/iAsure/discord-arts)


> # ⭐ Support
>
>> ### Send me a msg on discord! [iAsure#0001](https://discord.com/users/339919990947971105)

