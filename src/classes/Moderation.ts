// Imports
import { Options } from '../types/Options'
import { Base } from './Base'
import { Utils } from './Utils'
import { MuteManager } from './MuteManager'
import { MuteTypes } from '../constants'
import { MutesData } from '../types/MuteData'
import ModeratorError from './ModeratorError'

// Discord.JS
import { Client, GuildMember, Message } from 'discord.js'

export declare interface Moderation {
    client: Client
    options: Options

    // Classes
    utils: Utils
    mutes: MuteManager

    // Other
    isReady: boolean
}

/**
 * Main Moderation Class
 *
 * @class
 * @classdesc Class that enables Moderation System
 * @extends {Base}
 */
export class Moderation extends Base {
    /**
     * @param {Client} client - Discord.JS Client
     * @param {Options} options - Module Options
     * 
     * @constructor
     */
    constructor(client: Client, options: Options) {
        super()

        /**
         * Discord Client
         * @type {Client}
         */
        this.client = client

        /**
         * Module Options
         * @type {Options}
         */
        this.options = options

        /**
         * Module Utils
         * @type {Utils}
         */
        this.utils = new Utils(this.client, this.options)

        /**
         * Module Ready State
         * @type {boolean}
         */
        this.isReady = false

        if (this.options.storageType === 'json') this.utils.checkFile()

        this.client.on('ready', async () => {
            await this.utils.checkMutes()
        })

        this.client.on('guildMemberAdd', async (member) => {
            await this.utils.checkMute(member)
        })
    }

    /**
     * Method that Mutes or Temp Mutes Member
     *
     * @param {string} type - Type of the Mute
     * @param {Message} message - Discord Message
     * @param {GuildMember} member - Member to Mute
     * @param {string} reason - Reason of the Mute
     * @param {number} time - Time of the Temp Mute
     *
     * @returns {Promise<MutesData>}
     * @emits Moderation#muteMember
     */
    mute(
        type: MuteTypes,
        message: Message,
        member: GuildMember,
        reason?: string,
        time?: number
    ): Promise<MutesData> {
        return new Promise(async (res, rej) => {
            if (!['mute', 'tempmute'].includes(type))
                throw new ModeratorError(
                    'INVALID_TYPE',
                    ['mute', 'tempmute'],
                    type,
                    'mute#type'
                )
            if (type === 'tempmute' && time === undefined)
                throw new ModeratorError(
                    'UNDEFINED_VALUE',
                    'Number',
                    'undefined',
                    'mute#time'
                )

            return res(
                await this.mutes.create(type, message, member, reason, time)
            )
        })
    }

    /**
     * Method that unmutes Member
     *
     * @param {GuildMember} member - Member to Mute
     *
     * @returns {Promise<MutesData>}
     * @emits Moderation#unmuteMember
     */
    unmute(member: GuildMember): Promise<MutesData> {
        return new Promise(async (res, rej) => {
            return res(await this.mutes.delete(member))
        })
    }
}
