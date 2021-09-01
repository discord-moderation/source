import { Client, Intents } from "discord.js";
import Moderation from "../typings/Moderation";

const client = new Client({
    ws: {
        intents: Intents.ALL
    }
});

const moderation = new Moderation(client, {
    storage: './tests/db.json'
});

(async() => {
    client.on('message', async(message) => {
        const data = await moderation.warns(message.member);
    })
})