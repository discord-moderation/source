"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const Logger_1 = require("./Logger");
const Base_1 = require("./Base");
const package_json_1 = require("../../package.json");
const node_fetch_1 = __importDefault(require("node-fetch"));
// Storage Imports
const quick_db_1 = __importDefault(require("quick.db"));
const fs_1 = __importDefault(require("fs"));
/**
 * Utils Class
 *
 * @class
 * @classdesc Class that including some methods.
 * @extends {Base}
 */
class Utils extends Base_1.Base {
    /**
     *
     * @param {Client} client Discord.JS Client
     * @param {Options} options Module Options
     *
     * @constructor
     */
    constructor(client, options) {
        super();
        /**
         * Discord Client
         * @type {Client}
         */
        this.client = client;
        /**
         * Module Options
         * @type {Options}
         */
        this.options = options;
        /**
         * Module Logger
         * @type {Logger}
         */
        this.logger = new Logger_1.Logger();
    }
    /**
     * Method that will return Guild Data
     *
     * @param {Guild} guild Discord Guild
     * @returns {Promise<GuilData>}
     */
    getGuild(guild) {
        return new Promise(async (res, rej) => {
            if (!guild)
                return this.logger.error('Specify "Guild" in Utils#getGuild');
            switch (this.options.storageType) {
                case "sqlite": {
                    var data = quick_db_1.default.fetch(`guild.${guild.id}`);
                    if (data === undefined) {
                        this.createGuild(guild);
                        data = quick_db_1.default.fetch(`guild.${guild.id}`);
                    }
                    else
                        return res(data);
                }
                case "json": {
                    var file = JSON.parse(fs_1.default.readFileSync(this.options.storagePath).toString());
                    const data = file.find((x) => x.guildID === guild.id);
                    if (!data || data === undefined) {
                        this.createGuild(guild);
                        file = JSON.parse(fs_1.default.readFileSync(this.options.storagePath).toString());
                    }
                    else
                        return res(data);
                }
            }
        });
    }
    /**
     * Method that created Guild Data
     *
     * @param {Guild} guild - Discord Guild
     * @returns {Promise<boolean>}
     */
    createGuild(guild) {
        return new Promise(async (res, rej) => {
            if (!guild)
                return this.logger.error('Specify "Guild" in Utils#createGuild');
            switch (this.options.storageType) {
                case "sqlite": {
                    const data = quick_db_1.default.fetch(`guild.${guild.id}`);
                    if (data === undefined) {
                        quick_db_1.default.set(`guild.${guild.id}`, {
                            guildID: guild.id,
                            muteRole: null,
                            warns: [],
                            mutes: [],
                            immunityUsers: [],
                        });
                        return res(true);
                    }
                    else {
                        return rej(this.logger.warn(`Guild with name "${guild.name}" already placed in DB.`));
                    }
                }
                case "json": {
                    const file = JSON.parse(fs_1.default.readFileSync(this.options.storagePath).toString());
                    if (file.find((x) => x.guildID === guild.id)) {
                        return rej(this.logger.warn(`Guild with name "${guild.name}" already placed in DB.`));
                    }
                    const data = {
                        guildID: guild.id,
                        muteRole: null,
                        warns: [],
                        mutes: [],
                        immunityUsers: [],
                    };
                    file.push(data);
                    fs_1.default.writeFileSync(this.options.storagePath, JSON.stringify(file, null, "\t"));
                    return res(true);
                }
            }
        });
    }
    /**
     * Method that changes data in Storage
     *
     * @param {Guild} guild Discord Guild
     * @param {GuildData} newData New Guild Data
     * @returns {Promise<boolean>}
     */
    setData(guild, newData) {
        return new Promise(async (res, rej) => {
            if (!guild)
                return this.logger.error('Specify "Guild" in Utils#setData!');
            if (!newData)
                return this.logger.error('Specify "GuildData" in Utils#setData!');
            await this.getGuild(guild);
            switch (this.options.storageType) {
                case "sqlite": {
                    quick_db_1.default.set(`guild.${guild.id}`, newData);
                    return res(true);
                }
                case "json": {
                    const file = JSON.parse(fs_1.default.readFileSync(this.options.storagePath).toString());
                    fs_1.default.writeFileSync(this.options.storagePath, JSON.stringify(file, null, "\t"));
                    return res(true);
                }
            }
        });
    }
    /**
     * Method that will check Storage File every 5 seconds
     *
     * @returns {Promise<boolean>}
     */
    checkFile() {
        return new Promise(async (res, rej) => {
            if (this.options.storageType !== "json")
                return this.logger.error('Logger type is not "JSON"');
            setInterval(async () => {
                const path = this.options.storagePath;
                if (!fs_1.default.existsSync(path)) {
                    this.logger.warn("Creating Storage File...");
                    fs_1.default.writeFileSync(path, JSON.stringify([], null, "\t"));
                    await this.wait(1000);
                    this.logger.log("Created Storage File.");
                }
                const file = fs_1.default.readFileSync(path).toString();
                if (!file.startsWith("[") && !file.endsWith("]")) {
                    return this.logger.error("Storage File contains wrong data!");
                }
            }, 5000);
            res(true);
        });
    }
    /**
     * Method that checks mutes when client is ready
     *
     * @returns {Promise<boolean>}
     */
    checkMutes() {
        return new Promise(async (res, rej) => {
            switch (this.options.storageType) {
                case "sqlite": {
                    return this.client.guilds.cache.forEach(async (guild) => {
                        const data = await this.getGuild(guild);
                        if (!data.mutes.length)
                            return;
                        for (let i = 0; i < data.mutes.length; i++) {
                            const mute = data.mutes[i];
                            if (mute.type === "mute")
                                continue;
                            if (data.muteRole === null)
                                continue;
                            const muteRole = guild.roles.cache.get(data.muteRole);
                            if (!muteRole) {
                                return rej(this.logger.error(`Mute Role in "${guild.name}" isn't found!`));
                            }
                            const member = guild.members.cache.get(mute.memberID);
                            if (!member) {
                                return rej(this.logger.error(`Member with ID "${mute.memberID}" isn't found in server!`));
                            }
                            if (mute.unmutedAt === undefined)
                                continue;
                            if (Date.now() > mute.unmutedAt) {
                                await member.roles.remove(muteRole).catch((err) => {
                                    return rej(this.logger.error(err.message));
                                });
                                mute.unmutedAt = Date.now();
                                this.emit("unmuteMember", mute);
                            }
                            else {
                                const delay = mute.unmutedAt - Date.now();
                                setTimeout(async () => {
                                    await member.roles.remove(muteRole).catch((err) => {
                                        return rej(this.logger.error(err.message));
                                    });
                                    mute.unmutedAt = Date.now();
                                    this.emit("unmuteMember", mute);
                                }, delay);
                            }
                        }
                        return res(true);
                    });
                }
                case "json": {
                    return this.client.guilds.cache.forEach(async (guild) => {
                        const data = await this.getGuild(guild);
                        if (!data.mutes.length)
                            return;
                        for (let i = 0; i < data.mutes.length; i++) {
                            const mute = data.mutes[i];
                            if (mute.type === "mute")
                                continue;
                            if (data.muteRole === null)
                                continue;
                            const muteRole = guild.roles.cache.get(data.muteRole);
                            if (!muteRole) {
                                return rej(this.logger.error(`Mute Role in "${guild.name}" isn't found!`));
                            }
                            const member = guild.members.cache.get(mute.memberID);
                            if (!member) {
                                return rej(this.logger.error(`Member with ID "${mute.memberID}" isn't found in server!`));
                            }
                            if (mute.unmutedAt === undefined)
                                continue;
                            if (Date.now() > mute.unmutedAt) {
                                await member.roles.remove(muteRole).catch((err) => {
                                    return rej(this.logger.error(err.message));
                                });
                                mute.unmutedAt = Date.now();
                                this.emit("unmuteMember", mute);
                            }
                            else {
                                const delay = mute.unmutedAt - Date.now();
                                setTimeout(async () => {
                                    await member.roles.remove(muteRole).catch((err) => {
                                        return rej(this.logger.error(err.message));
                                    });
                                    mute.unmutedAt = Date.now();
                                    this.emit("unmuteMember", mute);
                                }, delay);
                            }
                        }
                        return res(true);
                    });
                }
            }
        });
    }
    /**
     * Method that create Timeout with Promise
     *
     * @param {number} ms Milliseconds
     * @returns {Promise<unknown>}
     */
    wait(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    checkUpdate() {
        return new Promise(async (res, rej) => {
            const data = await node_fetch_1.default("https://registry.npmjs.com/discord-moderation").then((res) => res.json());
            const lastVersion = data["dist-tags"]["latest"];
            if (package_json_1.version !== lastVersion) {
                return this.logger.warn('New Version of Discord-Moderation avaliable!\nWe recomend you to update this module using "npm i discord-moderation@latest" command,');
            }
        });
    }
}
exports.Utils = Utils;
//# sourceMappingURL=Utils.js.map