const { Client, Intents } = require("discord.js");
const client = new Client({
    ws: {
        intents: Intents.ALL
    }
});

const { Moderation } = require("../src");
const moderator = new Moderation(client, {
    storage: './tests/db.json'
});

moderator
