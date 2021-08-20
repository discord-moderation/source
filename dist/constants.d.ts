export declare type MuteTypes = "mute" | "tempmute";
export declare const ERROR_MESSAGES: {
    INVALID_TYPE: (expected: string | string[], got: any, name?: string | undefined) => string;
    UNDEFINED_VALUE: (expected: string, got: any, name: string) => string;
};
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
            reason: string;
        }
    ];
    warnAdd: [
        {
            id: number;
            guildID: string;
            moderatorID: string;
            memberID: string;
            channelID: string;
            reason: string;
        }
    ];
    warnRemove: [
        {
            id: number;
            guildID: string;
            memberID: string;
            moderatorID: string;
            channelID: string;
            reason: string;
        }
    ];
}
export interface GuildData {
    guildID: string;
    muteRole: null | string;
    warns: Array<WarnsData>;
    mutes: Array<MutesData>;
    immunityUsers: Array<ImmunityUsersData>;
}
export interface ImmunityUsersData {
    status: boolean;
    memberID: string;
}
export interface MutesData {
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
export interface WarnsData {
    id: number;
    guildID: string;
    memberID: string;
    moderatorID: string;
    channelID: string;
    reason: string;
}
export interface Options {
    storageType: "json" | "sqlite";
    storagePath: string;
}
//# sourceMappingURL=constants.d.ts.map