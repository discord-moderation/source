const { GuildMember, Guild, TextChannel, Client } = require("discord.js");
const { readFileSync, writeFileSync } = require("fs");
const Base = require("./Base");
const Logger = require("./Logger");
const Utils = require("./Utils");

/**
 * Class for Handle Mutes
 * 
 * @class
 * @classdesc Class that controls Warn System
 * @extends {Base}
 */
class MuteHandler extends Base {
    /**
     * @param {String} path Path to Storage File
     * @param {Object} opts Additional Options
     * @param {Client} opts.client Client for some things
     * @param {Number} opts.checkMutesTime Cooldown for Check Mutes
     */
    constructor(path, opts = {}) {
        super();

        /**
         * Storage Path
         * @type {String}
         */
        this.path = path;
        
        /**
         * Class Options
         * @type {Object}
         */
        this.options = opts;
        
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
     * Create new Mute.
     * @async
     * @param {String} type Mute Type
     * @param {Guild} guild Discord Guild
     * @param {GuildMember} member Discord Guild Member
     * @param {TextChannel} channel Discord Text Channel
     * @param {String} reason Reason of the Mute
     * @param {Number} time Time of the Temp Mute
     * @returns {MuteData | TempMuteData}
     */
    async create(type, guild, member, channel, reason, time = null) {
        if(!member) return this.logger.error('No Guild Member specified in MuteHandler#create.');
        if(!channel) return this.logger.error('No Text Channel specified in MuteHandler#create.');
        if(type === 'tempmute' && time === null) return this.logger.error('No Time specified in TempMute, MuteHandler#mute');
        if(!reason) reason = 'No Reason.';

        const file = JSON.parse(readFileSync(this.path).toString());
        const guildData = file.find((x) => x.guildID === guild.id);
        if(!guildData) this.utils.createGuild(guild);

        const muteRole = guildData.muteRole;

        const baseData = {
            id: guildData.mutes.length,
            type,
            guildID: guild.id,
            memberID: member.id,
            channelID: channel.id,
            reason,
            time,
            unmutedAt: (Date.now() + time)
        };

        const role = guild.roles.cache.get(muteRole);
        if(!role) return this.logger.error('No Role found in the Guild, MuteHandler#create.');

        try {
            await member.roles.add(role);
            guildData.mutes.push(baseData);

            this.emit('muteMember', baseData);

            if(type === 'tempmute') {
                setTimeout(async() => {
                   await member.roles.remove(role);

                   this.emit('unmuteMember', baseData);
                }, time);
            };
        } catch (error) {
            return this.logger.error(error.message);
        }

        return baseData;
    }

    /**
     * Delete Mute
     * 
     * @async
     * @param {Guild} guild Discord Guild
     * @param {TextChannel} channel Discord Text Channel
     * @param {string} id ID of the Mute
     * @returns {true}
     */
    async delete(guild, channel, id) {
        const file = JSON.parse(readFileSync(this.path).toString());
        const guildData = file.find((x) => x.guildID === guild.id);
        if(!guildData) this.utils.createGuild(guild);

        const mutes = guildData.mutes;
        const mute = mutes.find((x) => x.id === id);
        
        const role = guild.roles.cache.get(guildData.muteRole);
        if(!role) return this.logger.error('No Role found in the Guild, MuteHandler#delete.');

        const member = guild.members.cache.get(mute.memberID);
        if(!member) return this.logger.error(`No Member with id "${mute.memberID}" found in the Guild, MuteHandler#delete.`);

        if(!mute) return this.logger.warn(`No Mute with id "${id}" found, MuteHandler#delete.`);
        if(mute.type === 'tempmute') {
            if(Date.now() < mute.time) {    
                await member.roles.remove(role);

                return this.emit('unmuteMember', {
                    id,
                    type: 'tempmute',
                    guildID: guild.id,
                    memberID: mute.memberID,
                    channelID: channel.id,
                    reason: mute.reason,
                    time: mute.time,
                    unmutedAt: Date.now()
                });
            }
        }

        mutes.filter((x) => x.id !== id);
        member.roles.remove(role);

        this.emit('unmuteMember', {
            id,
            type: 'mute',
            guildID: guild.id,
            memberID: mute.memberID,
            channelID: channel.id,
            reason: mute.reason,
            time: mute.time,
            unmutedAt: Date.now()
        });

        writeFileSync(this.path, JSON.stringify(file, null, '\t'));
        return true;
    }

    /**
     * @async
     * @private
     * @returns {any}
     */
    async check() {
        setInterval(async() => {
            const guilds = JSON.parse(readFileSync(this.path).toString());
            guilds.forEach(async(_guild) => {
                if(!_guild.mutes.length) return;

                for(var i = 0; i < _guild.mutes.length; i++) {
                    const { id, type, guildID, memberID, channelID, unmutedAt, reason, time } = _guild.mutes[i];
                    const { muteRole } = _guild;

                    if(!muteRole) return;
                    if(type === 'tempmute') {
                        const guild = this.options.client.guilds.cache.get(guildID);
                        if(!guild) return;

                        const member = guild.members.cache.get(memberID);
                        if(!member) return this.logger.error(`No Member with id "${memberID}" found in the Guild, MuteHandler#check.`);
                        
                        const channel = guild.channels.cache.get(channelID);
                        if(!channel) return this.logger.error(`No Channel with id "${channelID}" found in the Guild, MuteHandler#check.`);
                        
                        const role = guild.roles.cache.get(muteRole);
                        if(!role) return this.logger.error('No Role found in the Guild, MuteHandler#check.'); 

                        if(Date.now() > unmutedAt) {  
                            await member.roles.remove(role);
            
                            return this.emit('unmuteMember', {
                                id,
                                type: 'tempmute',
                                guildID: guild.id,
                                memberID: member.id,
                                channelID: channel.id,
                                reason: reason,
                                time: time,
                                unmutedAt: Date.now()
                            });
                        }
                        else {
                            setInterval(async() => {
                                if(Date.now() > mute.unmutedAt) {  
                                    await member.roles.remove(role);
                    
                                    return this.emit('unmuteMember', {
                                        id,
                                        type: 'tempmute',
                                        guildID: guild.id,
                                        memberID: member.Id,
                                        channelID: channel.id,
                                        reason: reason,
                                        time: time,
                                        unmutedAt: Date.now()
                                    });
                                }
                            }, 30000);
                        }
                    }
                    else continue;
                }
            });
        }, this.options.checkMutesTime);

        return true;
    }
}

module.exports = MuteHandler;

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