import { TypedEmitter } from "tiny-typed-emitter";
import { Events } from "../constants";

/**
 * Base class that uses in all other classes.
 *
 * @class
 * @classdesc Base class that uses in all other classes.
 *
 * @private
 */
export class Base extends TypedEmitter<Events> {
  constructor() {
    super();
  }
}

/**
 * Module Options
 * @typedef {Object} Options
 * @prop {string} dbPath Storage Path
 * @prop {string} locale Date Locale (default 'en-US')
 * @prop {ModuleSystems} defaultSystems Default Systems Values
 */

/**
 * Module Options
 * @typedef {Object} ModuleSystems
 * @prop {boolean} autoRole Auto Role System
 * @prop {boolean} antiSpam Anti Spam System
 * @prop {boolean} antiInvite Anti Invite System
 * @prop {boolean} antiJoin Anti Join System
 * @prop {boolean} antiLink Anti Link System
 * @prop {boolean} blacklist Blacklist System
 * @prop {boolean} ghostPing Ghost Ping Detecting System
 */

/**
 * Mute Data
 * @typedef {Object} MutesData
 * @prop {number} id ID of the Mute
 * @prop {string} type Type of the Mute
 * @prop {string} guildID  Guild ID
 * @prop {string} memberID Member ID
 * @prop {string} moderatorID Moderator ID
 * @prop {string} channelID Channel ID
 * @prop {number} time Mute Time
 * @prop {number} unmutedAt Time when Member will be Unmuted
 */

/**
 * Guild Data
 * @typedef {Object} GuildData
 * @prop {string} guildID Guild ID
 * @prop {null | string} muteRole Mute Role ID
 * @prop {null | string} autoRole Auto Role ID
 * @prop {Array<WarnsData>} warns Guild Warns
 * @prop {Array<MutesData>} mutes Guild Mutes
 * @prop {Array<ImmunityUsersData>} ImmunityUsersData Users with Immunity
 */

/**
 * Warn Data
 * @typedef {Object} WarnsData
 * @prop {number} id ID of the Warn
 * @prop {string} guildID Guild ID
 * @prop {string} memberID Member ID
 * @prop {string} moderatorID Moderator ID
 * @prop {string} channelID Channel ID
 * @prop {number | null} warns Warns Length
 * @prop {string} reason Warn Reason
 */

/**
 * Immunity Users Data
 * @typedef {Object} ImmunityUsersData
 * @prop {boolean} status Status of Immunity
 * @prop {string} memberID Member ID
 */

/**
 * Users Map
 * @typedef {Object} userMap
 * @prop {number} msgCount Count of Sent User Messages
 * @prop {Message} lastMessage Last Message by User
 * @prop {NodeJS.Timeout} timer Timeout
 */

/**
 * Return Object
 * @typedef {Object} ReturnObject
 * @prop {boolean} status Status
 * @prop {string} [message] Error Message
 */

/**
 * * autorole
 * * antispam
 * * antiinvite
 * * antijoin
 * * antilink
 * * ghostping
 *
 * @typedef {string} AvaliableSystems
 */
