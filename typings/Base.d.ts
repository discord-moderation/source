export = Base;

declare class Base {
    public on<K extends keyof Events>(
        event: K,
        listener: (...args: Events[K]) => void
    ): this;

    public once<K extends keyof Events>(
        event: K,
        listener: (...args: Events[K]) => void
    ): this;

    public emit<K extends keyof Events>(event: K, ...args: Events[K]): boolean;
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