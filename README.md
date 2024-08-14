
<div align='center'>
  <img src='https://i.imgur.com/VBVAWrM.png' alt='Discord-Arts Banner' />
  <p align='center'>
  <a href='https://www.npmjs.com/package/discord-arts'>
    <img src='https://img.shields.io/npm/v/discord-arts?label=version&style=for-the-badge' alt='version' />
    <img src='https://img.shields.io/bundlephobia/min/discord-arts?label=size&style=for-the-badge' alt='size' />
    <img src='https://img.shields.io/npm/dt/discord-arts?style=for-the-badge' alt='downloads' />
  </a>
</p>
</div>

## 📦 Installation

```bash
npm i discord-arts@latest
```

## ✨ Features

- 🚀 Fast generation!
- 🎨 Simple and beautiful design
- 🎖️ Easy to use
- 💎 Beginner friendly
- ❌ Discord.js not required

## 📌 What's New

- 🖼️ Avatar decorations/frames
- 🎴 Automatic profile theme colors
- 🔮 Booster badges are back
- 🛡️ Automod and LegacyUsername badges

## 🖼️ Cards

### 🪄 profileImage(userId, imgOptions?)

Generate a profile image card for a user or bot, including badges and custom options.

![Default Profile Image](https://i.imgur.com/TWf8v1G.png)

**Returns:** Promise<Buffer>

#### imgOptions

| Option | Type | Description |
|--------|------|-------------|
| customUsername | string | Customize the username |
| customTag | string | Text below the user |
| customSubtitle | string | Text below the custom tag |
| customBadges | string[] | Your own png badges (path and URL) (46x46) |
| customBackground | string | Change the background to any image (path and URL) (885x303) |
| overwriteBadges | boolean | Merge your badges with the discord defaults |
| badgesFrame | boolean | Creates a small frame behind the badges |
| removeBadges | boolean | Removes badges, whether custom or from discord |
| removeBorder | boolean | Removes the image border, custom and normal |
| usernameColor | string | Username HEX color |
| tagColor | string | Tag HEX color |
| borderColor | string \| string[] | Border HEX color, can be gradient if 2 colors are used |
| borderAllign | string | Gradient alignment if 2 colors are used |
| disableProfileTheme | boolean | Disable the discord profile theme colors |
| presenceStatus | string | User status to be displayed below the avatar |
| squareAvatar | boolean | Change avatar shape to a square |
| removeAvatarFrame | boolean | Remove the discord avatar frame/decoration (if any) |
| rankData | object | Rank data options (see below) |
| moreBackgroundBlur | boolean | Triples blur of background image |
| backgroundBrightness | number | Set brightness of background from 1-100% |
| customDate | Date \| string | Custom date or text to use instead of when user joined Discord |
| localDateType | string | Local format for the date, e.g. 'en' \| 'es' etc. |

#### rankData Options

| Option | Type | Description |
|--------|------|-------------|
| currentXp | number | Current user XP |
| requiredXp | number | XP required to level up |
| level | number | Current user level |
| rank | number | Position on the leaderboard |
| barColor | string | HEX XP bar color |
| levelColor | string | HEX color of LVL text |
| autoColorRank | boolean | Whether to color ranks as medal colors for 1st, 2nd, 3rd |

## 📃 Code Example (Discord.js v14)

```javascript
const { AttachmentBuilder } = require('discord.js');
const { profileImage } = require('discord-arts');

await interaction.deferReply();
const user = interaction.options.getUser('user-option');

const buffer = await profileImage(user.id, {
  customTag: 'Admin',
  squareAvatar: true,
  // ... other imgOptions
});

interaction.followUp({ files: [buffer] });
```

## Example Results

### Rank Card

![Rank Card Example](https://i.imgur.com/Rd6ScN1.png)

```javascript
profileImage('UserID', {
  customBadges: ['./skull.png', './rocket.png', './crown.png'],
  presenceStatus: 'phone',
  badgesFrame: true,
  customDate: 'AWESOME!',
  moreBackgroundBlur: true,
  backgroundBrightness: 100,
  rankData: {
    currentXp: 2100,
    requiredXp: 3000,
    rank: 1,
    level: 20,
    barColor: '#fcdce1',
    levelColor: '#ada8c6',
    autoColorRank: true
  }
});
```

### Custom User Card

![Custom User Card Example](https://i.imgur.com/8wB4v2L.png)

```javascript
profileImage('UserID', {
  borderColor: ['#0000ff', '#00fe5a'],
  presenceStatus: 'idle',
  removeAvatarFrame: false
});
```

### Custom Bot Card

![Custom Bot Card Example](https://i.imgur.com/ldKbKvv.png)

```javascript
profileImage('UserID', {
  customBackground: 'https://i.imgur.com/LWcWzlc.png',
  borderColor: '#ec8686',
  presenceStatus: 'online',
  badgesFrame: true
});
```

## ⭐ Support

Join our [Discord Server](https://discord.gg/csedxqGQKP) for support and community discussions.
<iframe src="https://discord.com/widget?id=1233972329285947484&theme=dark" width="350" height="500" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>