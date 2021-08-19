export = MuteHandler;

declare class MuteHandler extends Base {
    public path: string;
    public utils: Utils;

    constructor(path: string, opts: Options);

    create(type: MuteTypes, guild: Guild, member: GuildMember, channel: TextChannel, reason?: string, time?: number): Promise<MuteEventData['muteMember']>;
    delete(guild: Guild, channel: TextChannel, id: string): Promise<true>;
    private check(guild: Guild): Promise<any>;
}

type MuteTypes = ('mute' | 'tempmute');

interface Options {
    client: Client,
    checkMutesTime: number
}
interface MuteEventData {
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
    }]
}

import { Client, Guild, GuildMember, TextChannel } from "discord.js";
import Base from "./Base";
import Utils from "./Utils";