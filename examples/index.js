const { Moderation } = require('../src/index') // It need to be 'discord-moderation';
const { Client, Intents, MessageEmbed } = require('discord.js');
const ms = require('ms'); // If not installed, exec 'npm i ms' into console.

const client = new Client({
    ws: {
        intents: Intents.ALL
    }
});

const moderation = new Moderation(client, {
    storage: './examples/db.json'
});

client.on('ready', () => {
    console.log('Client is ready.');
});

client.on('message', (message) => {
    if(!message.guild || message.author.bot) return;

    const prefix = '!';
    const args = message.content.slice(prefix.length).trim().split(' ');
    const cmd = args.shift().toLowerCase();

    if(cmd === 'mute') {
        const member = message.mentions.members.first();
        var reason = args.slice(0).join(' ');

        if(!member) return message.reply('mention any member!');
        if(!reason) reason = 'No Reason provided.';

        return moderation.mute(message.guild, member, message.channel, reason);
    }
    else if(cmd === 'tempmute') {
        const member = message.mentions.members.first();
        const time = args[0];
        var reason = args.slice(1).join(' ');

        if(!member) return message.reply('mention any member!');
        if(!time) return message.reply('write the time of the mute (1h, 1d)!');
        if(!reason) reason = 'No Reason provided.';

        return moderation.tempmute(message.guild, member, message.channel, reason, ms(time));
    }
    else if(cmd === 'unmute') {
        const id = args[0];
        if(!id) return message.reply('write the id of the mute!');

        return moderation.unmute(message.guild, message.channel, id);
    }
    else if(cmd === 'warn') {
        const member = message.mentions.members.first();
        var reason = args.slice(1).join(' ');

        if(!member) return message.reply('mention any member!');
        if(!reason) reason = 'No Reason provided.';

        return moderation.warn(member, message.channel, reason);
    }
    else if(cmd === 'unwarn') {
        const member = message.mentions.members.first();
        if(!member) return message.reply('mention any member!');

        return moderation.unwarn(member, message.channel);
    }
    else if(cmd === 'warns') {
        const member = message.mentions.members.first();
        if(!member) return message.reply('mention any member!');

        const { warns } = moderation.warns(member);

        const embed = new MessageEmbed()
        .setColor('BLUE')
        .setTitle(`${member.user.username}'s warns:`);

        for(let i = 0; i < warns.length; i++) {
            embed.addField(`[${i}] ${warns[i].reason}`, `› **Channel**: **${message.guild.channels.cache.get(warns[i].warns.toLocaleString())}**\n› **Warns**: **${warns[i].warns.toLocaleString()}**`)
        }

        return message.channel.send(embed);
    };
})

client.login('super-duper-bot-token'); // https://discord.com/developers/applications