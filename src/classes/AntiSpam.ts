import { Client, Message } from "discord.js";
import { MuteManager } from "./MuteManager";
import { Utils } from "./Utils";
import { Logger } from "./Logger";
import { Options } from '../constants';

interface userMap {
    msgCount: number;
    lastMessage: Message;
    timer: NodeJS.Timeout
}

export declare interface AntiSpam {
    client: Client;
    options: Options;

    mutes: MuteManager;
    utils: Utils;
    logger: Logger;

    usersMap: Map<string, userMap>;
}

export class AntiSpam {
    constructor(client: Client, options: Options) {
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
         * Mute Manager
         * @type {MuteManager}
         */
        this.mutes = new MuteManager(this.client, this.options);

        /**
         * Module Utils
         * @type {Utils}
         */
        this.utils = new Utils(this.client, this.options);

        /**
         * Module Logger
         * @type {Logger}
         */
        this.logger = new Logger();

        /**
         * Users Map
         * @type {Map<string, userMap>}
         */
        this.usersMap = new Map();
    }

    /**
     * Method that handles Anti-Spam System.
     * 
     * @param {Message} message Discord Message 
     * @returns {Promise<boolean>}
     */
    handle(message: Message): Promise<boolean> {
        return new Promise(async(res, rej) => {
            if(!this.options.systems?.antiSpam) return;
            if(!message) return this.logger.error('Specify "Message" in AntiSpam#_handle!');
            if(!message.guild) return;
            if(!message.member) return;

            const { muteRole } = await this.utils.getGuild(message.guild);
            if(!muteRole) return this.logger.error(`Guild "${message.guild.id}" hasn't a Mute Role!`);

            const role = message.guild.roles.cache.get(muteRole);
            if(!role) return this.logger.error(`Mute Role with ID "${muteRole}" not found in the Guild!`);

            const LIMIT = 7;
            const TIME = 15000;
            const DIFF = 5000;

            if(this.usersMap.has(message.author.id)) {
                const userData = this.usersMap.get(message.author.id);
                if(!userData) return;

                const { lastMessage, timer } = userData;
                const difference = (message.createdTimestamp - lastMessage.createdTimestamp);

                var msgCount = userData.msgCount;

                if(difference > DIFF) {
                    clearTimeout(timer);

                    userData.msgCount = 1;
                    userData.lastMessage = message;
                    userData.timer = setTimeout(() => {
                        this.usersMap.delete(message.author.id);
                    }, TIME);

                    this.usersMap.set(message.author.id, userData);
                }
                else {
                    ++msgCount;

                    if(Number(msgCount) === LIMIT) {
                        return this.mutes.create('tempmute', message, message.member, 'Anti-Spam System.', 3600000).then(async(muteData) => {
                            if(!message.member) return;

                            const embed = await this.utils.logEmbed('TempMute', message.member, muteData);
    
                            return message.member.send({
                                embeds: [embed]
                            }).catch((err) => {
                                return this.logger.error(err);
                            });
                        }); 
                    }
                    else {
                        userData.msgCount = msgCount;

                        this.usersMap.set(message.author.id, userData);
                    }
                }
            }
            else {
                const timeOut = setTimeout(() => {
                    this.usersMap.delete(message.author.id);
                }, TIME);

                this.usersMap.set(message.author.id, {
                    msgCount: 1,
                    lastMessage: message,
                    timer: timeOut
                });
            }

            return res(true);
        });
    }
}