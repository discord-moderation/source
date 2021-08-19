const { Client, GuildMember, TextChannel, Guild } = require('discord.js');
const { readFileSync, writeFileSync, existsSync } = require('fs');
const MuteManager = require('./MuteHandler');
const WarnManager = require('./WarnHandler');
const Base = require('./Base');
const Logger = require('./Logger');
const ms = require('../other/ms');

/**
 * Main Moderation Class
 * 
 * @class
 * @classdesc Class that enables Moderation System
 * @extends {Base}
 */
class Moderation extends Base {
    /**
     * @param {Client} client Discord.JS Client
     * @param {Options} opts Module Options
     */
    constructor(client, opts) {
        super();

        if(!client) return logger.error('No Client defined in Module Constructor!');
        if(opts && !opts.storage) return logger.error('No Storage File defined in Module Constructor!');
        
        /**
         * Discord Client
         * @type {Client}
         */
        this.client = client;
        
        /**
         * Module Logger
         * @type {Logger}
         */
        this.logger = new Logger();
        
        /**
         * Class Options
         * @type {Options}
         */
        this.options = opts;
    
        /**
         * Mute Manager
         * @type {MuteManager}
         */
        this.mutes = new MuteManager(this.options.storage, {
            client: this.client,
            checkMutesTime: 3000
        });
        
        /**
         * Warns Manager
         * @type {WarnManager}
         */
        this.warns = new WarnManager(this.options.storage);
        
        /**
         * Module Version
         * @type {String}
         */
        this.version = (require('../../package.json').version);
        
        /**
         * Module State
         * @type {Boolean}
         */
        this.ready = false;

        this._init();
        this.client.on('ready', () => {
            return this.client.guilds.cache.forEach(async() => await this.mutes.check());
        });
    }

    /**
     * Gives Mute to the Member.
     * 
     * @param {Guild} guild Discord Guild
     * @param {GuildMember} member Discord Guild
     * @param {TextChannel} channel Discord Text Channel
     * @param {String} reason Reason of the Mute
     * @returns {MuteData}
     *
     * @fires Moderation#muteMember
     */
    mute(guild, member, channel, reason) {
        if(!this.ready) return this.logger.error('This module isn\'t ready!');
        if(!member) return this.logger.error('No Guild Member specified in Moderation#mute.');
        if(!channel) return this.logger.error('No Text Channel specified in Moderation#mute.');
        if(!reason) reason = 'No Reason.';
        
        return this.mutes.create('mute', guild, member, channel, reason);
    }

    /**
     * Gives TempMute to the Member.
     * 
     * @param {Guild} guild Discord Guild
     * @param {GuildMember} member Discord Guild
     * @param {TextChannel} channel Discord Text Channel
     * @param {String} reason Reason of the Mute
     * @param {Number} time Time of the Temp Mute
     * @returns {TempMuteData}
     *
     * @fires Moderation#muteMember
     * @fires Moderation#unmuteMember
     */
    tempmute(guild, member, channel, reason, time) {
        if(!this.ready) return this.logger.error('This module isn\'t ready!');
        if(!member) return this.logger.error('No Guild Member specified')
        if(!reason) reason = 'No Reason.';
        
        return this.mutes.create('tempmute', guild, member, channel, reason, ms(time));
    }

    /**
     * Removes Mute to the Member.
     * 
     * @param {Guild} guild Discord Guild
     * @param {TextChannel} channel Discord Text Channel
     * @param {String} id ID of the Mute
     * @returns {true}
     *
     * @fires Moderation#unmuteMember
     */
    unmute(guild, channel, id) {
        if(!this.ready) return this.logger.error('This module isn\'t ready!');
        if(!guild) return this.logger.error('No Guild specified in Moderation#unmute.');
        if(!channel) return this.logger.error('No Text Channel specified in Moderation#unmute.');
        if(!id) return this.logger.error('No Mute ID specified in Moderation#unmute.');

        return this.mutes.delete(guild, channel, id);
    }

    /**
     * Gives Warn to the Member.
     * 
     * @param {GuildMember} member Discord Guild Member
     * @param {TextChannel} channel Discord Text Channel
     * @param {String} reason Reason of the Warn
     * @returns {WarnData}
     *
     * @fires Moderation#warnAdd
     * @fires Moderation#warnKick
     * @fires Moderation#warnBan
     */
    warn(member, channel, reason) {
        if(!this.ready) return this.logger.error('This module isn\'t ready!');
        if(!member) return this.logger.error('No Guild Member specified in Moderation#warn.');
        if(!channel) return this.logger.error('No Text Channel specified in Moderation#warn.');
        if(!reason) reason = 'No Reason.';

        return this.warns.add(member, channel, reason);
    }

    /**
     * Removes Warn to the Member.
     * 
     * @param {GuildMember} member Discord Guild Member
     * @param {TextChannel} channel Discord Text Channel
     * @returns {true}
     *
     * @fires Moderation#warnRemove
     */
    unwarn(member, channel) {
        if(!this.ready) return this.logger.error('This module isn\'t ready!');
        if(!member) return this.logger.error('No Guild Member specified in Moderation#warn.');
        if(!channel) return this.logger.error('No Text Channel specified in Moderation#warn.');
        if(!reason) reason = 'No Reason.';

        return this.warns.remove(member, channel, reason);
    }

    /**
     * Gives length and data of Member Warns.
     * @param {GuildMember} member Discord Guild Member
     * @returns {WarnsData}
     */
    warns(member) {
        if(!this.ready) return this.logger.error('This module isn\'t ready!');
        if(!member) return this.logger.error('No Guild Member specified in Moderation#warn.');

        return this.warns.get(member);
    }

    /**
     * Initializate Module
     * 
     * @private
     */
    _init() {
        if(!this.options.checkMutesTime) this.options.checkMutesTime = 3000;

        setInterval(() => {
            const path = this.options.storage;

            if(!existsSync(path)) {
                writeFileSync(path, JSON.stringify([], null, '\t'));
    
                this.logger.log('No Storage File found, created new one.');
            };

            const file = readFileSync(path).toString();
            if(!file.startsWith('[') && !file.endsWith(']')) return this.logger.error('Storage File containts wrong data!');
        }, 5000);

        this.ready = true;
    }
}

module.exports = Moderation;

/**
 * Emites when someone mutes member.
 * 
 * @event Moderation#muteMember
 * @param {Number} id - ID of the Mute
 * @param {String} type - Type of the Action
 * @param {String} guildID - ID of the Guild
 * @param {String} memberID - ID of the Member
 * @param {String} channelID - ID of the Channel
 * @param {String} reason - Reason of the Mute
 * @param {Number} time - Mute Time
 * @param {Number} unmutedAt - Mute Unmute Time
 */

/**
 * Emites when someone unmutes member.
 * 
 * @event Moderation#unmuteMember
 * @param {Number} id - ID of the Mute
 * @param {String} type - Type of the Action
 * @param {String} guildID - ID of the Guild
 * @param {String} memberID - ID of the Member
 * @param {String} channelID - ID of the Channel
 * @param {String} reason - Reason of the Mute
 * @param {Number} time - Mute Time
 * @param {Number} unmutedAt - Mute Unmute Time
 */

/**
 * Emites when someone warns member.
 * 
 * @event Moderation#warnAdd
 * @param {Number} id - ID of the Warn
 * @param {String} type - Type of the Action
 * @param {String} guildID - ID of the Guild
 * @param {String} memberID - ID of the Member
 * @param {String} channelID - ID of the Channel
 * @param {Number | String | null} warns - Length of the User Warns
 * @param {String} reason - Reason of the Warn
 */

/**
 * Emites when someone remove warn to member.
 * 
 * @event Moderation#warnRemove
 * @param {String} type - Type of the Action
 * @param {String} guildID - ID of the Guild
 * @param {String} memberID - ID of the Member
 * @param {String} channelID - ID of the Channel
 * @param {Number | String | null} warns - Length of the User Warns
 */

/**
 * Emites when module kicks member with 3 warns.
 * 
 * @event Moderation#warnKick
 * @param {String} guildID - ID of the Guild
 * @param {String} memberID - ID of the Member
 * @param {String} channelID - ID of the Channel
 * @param {Number} warns - Length of the User Warns
 * @param {String} reason - Reason of the Warn
 */

/**
 * Emites when module bans member with 6 warns.
 * 
 * @event Moderation#warnBan
 * @param {String} guildID - ID of the Guild
 * @param {String} memberID - ID of the Member
 * @param {String} channelID - ID of the Channel
 * @param {Number} warns - Length of the User Warns
 * @param {String} reason - Reason of the Warn
 */

/**
 * @typedef {Object} Options
 * @param {String} storage - Storage Path
 */

/**
 * @typedef {Object} MuteData
 * @property {Number} id - Mute ID
 * @property {String} type - Mute Time
 * @property {String} guildID - Guild ID
 * @property {String} memberID - Member ID
 * @property {String} channelID - Channel ID
 * @property {String} reason - Channel ID
 */

/**
 * @typedef {Object} TempMuteData
 * @property {Number} id - Mute ID
 * @property {String} type - Mute Time
 * @property {String} guildID - Guild ID
 * @property {String} memberID - Member ID
 * @property {String} channelID - Channel ID
 * @property {String} reason - Channel ID
 * @property {Number} time - Mute Time
 * @property {Number} unmutedAt - Member Unmute TIme
 */

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