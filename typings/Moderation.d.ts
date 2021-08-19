export = Moderation;

declare class Moderation extends Base {
    public client: Client;
    public options: Options;
    public logger: Logger;
    public muteManager: MuteHandler;
    public warnManager: WarnHandler;
    public version: string;
    public ready: false;

    constructor(client: Client, opts: Options);
    
    mute(guild: Guild, member: GuildMember, channel: TextChannel, reason: string): Promise<Events['muteMember']>;
    tempmute(guild: Guild, member: GuildMember, channel: TextChannel, reason: string, time: number): Promise<Events['muteMember']>;
    unmute(guild: Guild, member: GuildMember, channel: TextChannel, reason: string): Promise<Events['unmuteMember']>;
    
    warn(member: GuildMember, channel: TextChannel, reason: string): Promise<Events['warnAdd']>;
    unwarn(member: GuildMember, channel: TextChannel): Promise<Events['warnRemove']>;
    warns(member: GuildMember): Promise<GetMethodData>;

    private _init(): void;
}

interface Options {
    storage: string;
}

interface GetMethodData {
    length: number,
    warns: Array<Events['warnAdd']>
}

interface Events {
    muteMember: [{
        id: number,
        type: ('tempmute' | 'mute'),
        guildID: string,
        memberID: string,
        channelID: string,
        reason: string,
        time: number,
        unmutedAt: number
    }],

    unmuteMember: [{
        id: number,
        type: ('tempmute' | 'mute'),
        guildID: string,
        memberID: string,
        channelID: string,
        reason: string,
        time: number,
        unmutedAt: number
    }],

    warnKick: [{
        guildID: string,
        memberID: string,
        channelID: string,
        warns: 3,
        reason: string
    }],

    warnBan: [{
        guildID: string,
        memberID: string,
        channelID: string,
        warns: 6,
        reason: string
    }],

    warnAdd: [{
        id: number,
        type: 'warn'
        guildID: string,
        memberID: string,
        channelID: string,
        warns: (number | string | null),
        reason: string
    }],

    warnRemove: [{
        type: 'unwarn'
        guildID: string,
        memberID: string,
        channelID: string,
        warns: (number | string | null)
    }],
}

import { Client, Guild, TextChannel, GuildMember } from 'discord.js';
import Base from './Base';
import Logger from './Logger';
import MuteHandler from './MuteHandler';
import WarnHandler from './WarnHandler';