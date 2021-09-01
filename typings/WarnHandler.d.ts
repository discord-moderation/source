export = WarnHandler;

declare class WarnHandler extends Base {
    public path: string;
    public utils: Utils;

    constructor(path: string);

    add(member: GuildMember, channel: TextChannel, reason: string): Promise<WarnEventData['warnAdd']>;
    remove(member: GuildMember, channel: TextChannel): Promise<true>;
    get(member: GuildMember): Promise<GetMethodData>;
    private _delete(member: GuildMember): any;
}

interface GetMethodData {
    length: number,
    warns: Array<WarnEventData['warnAdd']>
}

interface WarnEventData {
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
    }]
}

import { GuildMember, TextChannel } from "discord.js";
import Base from "./Base";
import Utils from "./Utils";