export interface Events {
    muteMember: [
        {
            id: number;
            type: string;
            guildID: string;
            memberID: string;
            moderatorID: string;
            channelID: string;
            reason: string;
            time?: number;
            unmutedAt?: number;
        }
    ];
    unmuteMember: [
        {
            id: number;
            type: string;
            guildID: string;
            memberID: string;
            moderatorID: string;
            channelID: string;
            reason: string;
            time?: number;
            unmutedAt?: number;
        }
    ];
    warnKick: [
        {
            guildID: string;
            memberID: string;
            moderatorID: string;
            channelID: string;
            warns: number;
            reason: string;
        }
    ];
    warnBan: [
        {
            guildID: string;
            memberID: string;
            moderatorID: string;
            channelID: string;
            warns: number;
            reason: string;
        }
    ];
    warnAdd: [
        {
            id: number;
            type: string;
            guildID: string;
            moderatorID: string;
            memberID: string;
            channelID: string;
            warns: number | string | null;
            reason: string;
        }
    ];
    warnRemove: [
        {
            type: string;
            guildID: string;
            memberID: string;
            moderatorID: string;
            channelID: string;
            warns: number | string | null;
        }
    ];
}
//# sourceMappingURL=Events.d.ts.map