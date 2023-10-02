
<div align='center'>
  <img src='https://i.imgur.com/o3jM8MJ.png' alt='Discord-Arts Banner' />
  <p align='center'>
  <a href='https://www.npmjs.com/package/discord-arts'>
    <img src='https://img.shields.io/npm/v/discord-arts?label=version&style=for-the-badge' alt='version' />
    <img src='https://img.shields.io/bundlephobia/min/discord-arts?label=size&style=for-the-badge' alt='size' />
    <img src='https://img.shields.io/npm/dt/discord-arts?style=for-the-badge' alt='downloads' />
  </a>
</p>
</div>

<p align="center">
  <strong>- Customized cards with Discord style -</strong>
</p>

***

# 📦 Installation

```bash
npm i discord-arts@latest
```

# ✨ Features

+ 🚀 Fast generation!
+ 🎨 Simple and beautiful design
+ 🎖️ Easy to use
+ 💎 Beginner friendly

# 🖼️ Cards

## 🪄 profileImage(userId, imgOptions?)

*Generates the card of a user/bot, with its badges.*

```js
profileImage(userId, {
  customTag?: string, // Text below the user
  customBadges?: string[], // Your own png badges (path and URL) (46x46)
  customBackground?: string, // Change the background to any image (path and URL) (885x303)
  overwriteBadges?: boolean, // Merge your badges with the discord defaults
  badgesFrame?: boolean, // Creates a small frame behind the badges
  removeBadges?: boolean, // Removes badges, whether custom or from discord
  removeBorder?: boolean, // Removes the image border, custom and normal
  usernameColor?: string, // Username HEX color
  tagColor?: string, // Tag HEX color
  borderColor?: string | string[], // Border HEX color, can be gradient if 2 colors are used
  borderAllign?: string, // Gradient alignment if 2 colors are used
  presenceStatus?: string, // User status to be displayed below the avatar
  squareAvatar?: boolean, // Change avatar shape to a square
  rankData?: {
    currentXp: number, // Current user XP
    requiredXp: number, // XP required to level up
    level: number, // Current user level
    rank?: number, // Position on the leaderboard
    barColor?: string, // HEX XP bar color

    // === Options added by Cannicide#2753 ===
    levelColor?: string, // HEX color of LVL text
    autoColorRank?: boolean, // Whether to color ranks as medal colors for 1st, 2nd, 3rd
  }

  // === Options added by Cannicide#2753 ===
  moreBackgroundBlur?: boolean, // Triples blur of background image
  backgroundBrightness?: number, // Set brightness of background from 1-100%
  customDate?: Date || string, // Custom date or text to use instead of when user joined Discord
})
```

#### Returns: **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<**[Buffer](https://nodejs.org/api/buffer.html)**>**

***

### 📃 Discord.js v14 Example

```javascript
const { AttachmentBuilder } = require('discord.js');
const { profileImage } = require('discord-arts');

await interaction.deferReply();
const user = interaction.options.getUser('user-option');

const buffer = await profileImage(user.id, {
  customTag: 'Admin',
  squareAvatar: true,
  ...imgOptions
});

const attachment = new AttachmentBuilder(buffer, { name: 'profile.png' });
interaction.followUp({ files: [attachment] });
```

***

### 🖼️Example Results 

## Default Card

> ![Default](https://i.imgur.com/IlTioY4.png)
>> ```javascript
>> profileImage('UserID')
>> ```

***

## Rank Card

> ![Default](https://i.imgur.com/30qVLRx.png)
>> ```javascript
>> profileImage('UserID', {
>>   customBadges: [  './skull.png', './letter.png', './rocket.png', './crown.png', './hearth.png'  ],
>>   borderColor: '#087996',
>>   presenceStatus: 'phone',
>>   badgesFrame: true,
>>   customDate: 'AWESOME!',
>>   moreBackgroundBlur: true,
>>   backgroundBrightness: 100,
>>   rankData: {
>>     currentXp: 2100,
>>     requiredXp: 3000,
>>     rank: 1,
>>     level: 20,
>>     barColor: '0b7b95',
>>     levelColor: '00d7ff',
>>     autoColorRank: true
>>   }
>> });
>> ```

***

## Custom User Card

> ![Default](https://i.imgur.com/xnRXSaS.png)
>> ```javascript
>> profileImage('UserID', {
>>   borderColor: ['#0000ff', '#00fe5a'],
>>   presenceStatus: 'idle',
>>   squareAvatar: true
>>   badgesFrame: true,
>> });
>> ```

***

## Custom Bot Card

> ![Default](https://i.imgur.com/crv9akL.png)
>> ```javascript
>> profileImage('UserID', {
>>   customBackground: 'https://i.imgur.com/LWcWzlc.png',
>>   borderColor: '#ec8686',
>>   presenceStatus: 'online',
>>   badgesFrame: true
>> });
>> ```

***

> # 💥 Issues / Feedback
> 
> ### Any problem or feedback, open an issue in our github repository [here](https://github.com/iAsure/discord-arts)


> # ⭐ Support
>
> ### Send me a msg on discord! [iAsure#0001](https://discord.com/users/339919990947971105)

