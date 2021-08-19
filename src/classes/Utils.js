const { Guild, Role } = require("discord.js");
const { writeFileSync, readFileSync } = require("fs");
const Logger = require("./Logger");

/**
 * Utils Class
 * 
 * @class
 * @classdesc Class that including some methods.
 */
class Utils {
    /**
     * @param {String} path Storage Path
     */
    constructor(path) {
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
    }

    /**
     * @param {Guild} guild Discord Guild
     */
    createGuild(guild) {
        if(!guild) return this.logger.error('No Guild specified in Utils#createGuild.');

        const file = JSON.parse(readFileSync(this.path).toString());
        const data = {
            guildID: guild.id,
            muteRole: null,
            mutes: [],
            warns: []
        };

        file.push(data);
        writeFileSync(this.path, JSON.stringify(file, null, '\t'));
    }

    /**
     * @param {Role} role Discord Guild Role
     */
    setMuteRole(role) {
        if(!role) return this.logger.error('No Role specified in Utils#setMuteRole.');

        const file = JSON.parse(readFileSync(this.path).toString());
        const guildData = file.find((x) => x.guildID === role.guild.id);
        if(!guildData) this.createGuild(role.guild);

        guildData.muteRole = role.id;
        writeFileSync(this.path, JSON.stringify(file, null, '\t'));
    }
}

module.exports = Utils;