const { GuildMember, TextChannel } = require("discord.js");
const { readFileSync, writeFileSync } = require("fs");
const Utils = require("./Utils");
const Base = require("./Base");
const Logger = require("./Logger");

/**
 * Class that controls Warn System
 * 
 * @class
 * @classdesc Class that controls Warn System
 * @extends {Base}
 */
class WarnHandler extends Base {
    /**
     * @param {String} path Path of the Storage File 
     */
    constructor(path) {
        super();
        
        /**
         * Storage Path
         * @type {String}
         */
        this.path = path;
        
        /**
         * Module Logger
         * @type {Logger}
         */
        this.logger = new Logger();
        
        /**
         * Module Utils
         * @type {Utils}
         */
        this.utils = new Utils(this.path);
    }

    /**
     * Adds a Warn to Member.
     * 
     * @async
     * @param {GuildMember} member Discord Guild Member
     * @param {TextChannel} channel Discord Text Channel
     * @param {String} reason Reason of the Warn
     * @returns {WarnData}
     */
    async add(member, channel, reason) {
        if(!member) return this.logger.error('No Guild Member defined in WarnHandler#add');
        if(!channel) return this.logger.error('No Text Channel defined in WarnHandler#add');
        if(!reason) reason = 'No Reason.';

        const file = JSON.parse(readFileSync(this.path).toString());
        var guildData = file.find((x) => x.guildID === member.guild.id);
        if(!guildData) {
            this.utils.createGuild(member.guild);
            guildData = file.find((x) => x.guildID === member.guild.id);
        }

        const baseData = {
            id: guildData.warns.length,
            type: 'warn',
            guildID: member.guild.id,
            memberID: member.id,
            channelID: channel.id,
            warns: null,
            reason
        };

        if(!guildData.warns.length) baseData.warns = 1;
        else baseData.warns = (guildData.warns.length + 1);

        guildData.warns.push(baseData);

        if(guildData.warns.length === 3) {
            if(member.kickable) await member.kick('User reached 3 warns!');
            else return this.logger.warn(`Cannot kick ${member.user.tag}!`);

            this.emit('warnKick', {
                guildID: member.guild.id,
                memberID: member.id,
                channelID: channel.id,
                warns: 3,
                reason: 'User reached 3 warns!'
            });
        }
        else if(guildData.warns.length === 6) {
            if(member.bannable) await member.ban({
                days: 7,
                reason
            });
            else return this.logger.warn(`Cannot ban ${member.user.tag}!`);

            this.emit('warnBan', {
                guildID: member.guild.id,
                memberID: member.id,
                channelID: channel.id,
                warns: 6,
                reason: 'User reached 6 warns!'
            });

            this._delete(member);
        }

        this.emit('warnAdd', baseData);
        return baseData;
    }

    /**
     * Removes 1 Warn to Member.
     * 
     * @async
     * @param {GuildMember} member 
     * @param {TextChannel} channel 
     * @returns {true}
     */
    async remove(member, channel) {
        if(!member) return this.logger.error('No Guild Member defined in WarnHandler#remove');
        if(!channel) return this.logger.error('No Text Channel defined in WarnHandler#remove');
        
        const file = JSON.parse(readFileSync(this.path).toString());
        const guildData = file.find((x) => x.guildID === member.guild.id);
        if(!guildData) this.utils.createGuild(guild);

        const check = guildData.warns.filter((x) => x.memberID === member.id);
        
        if(!check) return this.logger.error('No Warn Data found in Guild Data, WarnHandler#remove');
        if(check.length < 1) return this.logger.error('Warns Length should be more than 1! WarnHandler#remove');

        const lastIndex = guildData.warns.length;
        guildData.warns.filter((x) => x.memberID === member.id && x.id !== lastIndex);

        this.emit('warnRemove', {
            type: 'unwarn',
            guildID: member.guild.id,
            memberID: member.id,
            channelID: channel.id,
            warns: guildData.warns.length
        });

        writeFileSync(this.path, JSON.stringify(file, null, '\t'));
        return true;
    }

    /**
     * Returns all the Warns of the Member.
     * 
     * @async
     * @param {GuildMember} member Discord Guild Member 
     * @returns {WarnsData}
     */
    async get(member) {
        if(!member) return this.logger.error('No Guild Member defined in WarnHandler#remove');

        const file = JSON.parse(readFileSync(this.path).toString());
        const guildData = file.find((x) => x.guildID === member.guild.id);
        if(!guildData) this.utils.createGuild(guild);

        const warns = guildData.warns.filter((x) => x.memberID === member.id);
        return {
            length: warns.length,
            warns
        };
    }

    /**
     * @async
     * @private
     * @param {GuildMember} member 
     * @returns {true}
     */
    _delete(member) {
        if(!member) return this.logger.error('No Guild Member defined in WarnHandler#_delete');

        const file = JSON.parse(readFileSync(this.path).toString());
        const guildData = file.find((x) => x.guildID === member.guild.id);
        if(!guildData) this.utils.createGuild(guild);

        const check = guildData.warns.filter((x) => x.memberID === member.id);

        if(!check) return this.logger.error('No Warn Data found in Guild Data, WarnHandler#_delete');
        if(check.length === 6) {
            guildData.warns.filter((x) => x.memberID !== member.id);

            writeFileSync(this.path, JSON.stringify(file, null, '\t'));
        };

        return true;
    }
}

module.exports = WarnHandler;

/**
 * @typedef {Object} WarnData
 * @property {Number} id - Mute ID
 * @property {String} type - Mute Time
 * @property {String} guildID - Guild ID
 * @property {String} memberID - Member ID
 * @property {String} channelID - Channel ID
 * @property {Number} warns - Member Warns Count
 * @property {String} reason - Channel ID
 */


/**
 * @typedef {Object} WarnsData
 * @property {Number} length - Mute ID
 * @property {Array<WarnData>} warns - Member Warns
 */