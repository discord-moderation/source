import { Client, TextChannel } from 'discord.js'
import { Moderation } from '../src/index' // replace '../src/index' with 'discord-moderation'
import ms from 'ms';

const client = new Client({
    intents: ['GUILDS', 'GUILD_BANS', 'GUILD_INVITES', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_PRESENCES']
});
const moderation = new Moderation(client, {
    dbPath: __dirname,
    locale: 'en-US',
    systems: {
        antiInvite: false,
        antiJoin: false,
        antiLink: false,
        antiSpam: false,
        autoRole: false,
        ghostPing: false
    }
}); // You can enable systems that You want.

client.once('ready', () => {
    console.log('# Client started!');
});

client.on('messageCreate', async(msg) => {
    const prefix = '!';

    if(!msg.guild || !msg.guild.available || msg.author.bot) return;
    if(!msg.content.startsWith(prefix)) return;

    const args = msg.content.slice(prefix.length).trim().split(' ');
    const cmd = args.shift().toLowerCase();

    if(cmd === 'mute') {
        if(!msg.member.permissions.has(['ADMINISTRATOR'])) return; // You can change required permissions

        const member = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]);
        var reason = args.slice(1).join(' ');

        if(!member) {
            msg.reply('Mention any member!');

            return;
        }

        if(member.roles.highest > msg.guild.me.roles.highest) {
            msg.reply('I can\'t mute this person, because his role is higher than mine');

            return;
        }

        if(!reason) reason = 'No Reason Provided.';

        moderation.mute('mute', msg, member, reason);
        return;
    }
    else if(cmd === 'tempmute') {
        if(!msg.member.permissions.has(['ADMINISTRATOR'])) return; // You can change required permissions

        const member = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]);
        var time = args[1];
        var reason = args.slice(2).join(' ');

        if(!member) {
            msg.reply('Mention any member!');

            return;
        }

        if(!time) {
            msg.reply('Write the time of mute!');

            return;
        }

        if(member.roles.highest > msg.guild.me.roles.highest) {
            msg.reply('I can\'t mute this person, because his role is higher than mine');

            return;
        }

        if(!reason) reason = 'No Reason Provided.';

        moderation.mute('tempmute', msg, member, reason, ms(time));
        return;
    }
    else if(cmd === 'muterole-set') {
        if(!msg.member.permissions.has(['ADMINISTRATOR'])) return; // You can change required permissions

        const role = msg.mentions.roles.first() || msg.guild.roles.cache.get(args[0]);
        if(!role) {
            msg.reply('Mention any role!');

            return;
        }

        moderation.mutes.setRole(msg.guild, role);

        msg.reply(`Changed Mute Role to ${role.toString()}`);
        return;
    }
    // ...
});

moderation.on('muteMember', async(data) => {
    const guild = client.guilds.cache.get(data.guildID);
    const channel = (guild.channels.cache.get(data.channelID) as TextChannel);
    const member = guild.members.cache.get(data.memberID);

    const embed = await moderation.utils.logEmbed('Mute', member, data);

    return channel.send({
        embeds: [embed]
    });
});
// ...

client.login('TOKEN-HERE') // https://discord.com/developers/applications/