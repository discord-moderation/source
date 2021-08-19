<img src="https://raw.githubusercontent.com/bad-boy-discord/discord-moderation/main/assets/discord-moderation-main.png" />
<hr>

## Welcome
<b>Welcome! This 'discord-moderation' module!</b><br>
<b>This module that simplify creating moderation system to your discord bot.</b>

## Requirements
- <b>Node.JS v14</b>
- <b>Discord.JS v12</b>

## Module Classes:
- 'Moderation' - <b>Main class that enables all the Moderation System.</b>
- 'MuteHandler' - <b>Class that enables Mute System.</b>
- 'WarnHandler' - <b>Class that enables Warn System.</b>
- 'Logger' - <b>Class that logs something.</b>
- 'Utils' - <b>Class that includes some utils for other classes.</b>

### Warning!
<b>To use __mute__ methods, You need to set MuteRole using setMuteRole in Utils#setMuteRole!</b>

### Module Options
- 'storage' - <b>Required for creating, parsing, editing DB File.</b>

### Quick Inialization Example
```js
const { Client, Intents } = require('discord.js');
const { Moderation } = require('discord-moderation');

const client = new Client({
  ws: {
    intents: Intents.ALL
  }
});

const moderation = new Moderation(client, {
  storage: './db/db.json'
});
```

## This module uses
- <b><a href='https://discord.js.org'>Discord.JS v12</a></b>
- <b><a href='https://www.npmjs.com/package/fs'>fs</a></b>
- <b><a href='https://www.npmjs.com/package/ms'>ms</a></b>

## Examples
<b><a href="https://github.com/bad-boy-discord/discord-moderation/tree/main/examples">Click here to see JavaScript and TypeScript examples.</a></b>

## Links
<b>Module Creator: <a href="https://www.npmjs.com/~badboy-discord">badboy-discord</a></b><br>
<b>Creator Discord: <a href="https://discord.com/545956523571150858">goose#1046</a></b><br>
<b>NodeJS: <a href="https://www.nodejs.org/">Click</a></b><br>
<b>TypeScript: <a href="https://www.typescriptlang.org/">Click</a></b><br>
<b>Support Server: <a href="https://discord.gg/eGZfaWsZgR">Click</a></b><br>
<b>Website: <a href="https://dm-web.tk/">Click</a></b>