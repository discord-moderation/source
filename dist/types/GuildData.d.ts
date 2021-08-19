export interface GuildData {
    guildID: string;
    muteRole: null | string;
    warns: Array<WarnsData>;
    mutes: Array<MutesData>;
    immunityUsers: Array<ImmunityUsersData>;
}
interface WarnsData {
    id: number;
    guildID: string;
    memberID: string;
    moderatorID: string;
    channelID: string;
    warns: number | null;
    reason: string;
}
interface MutesData {
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
interface ImmunityUsersData {
    status: boolean;
    memberID: string;
}
export {};
//# sourceMappingURL=GuildData.d.ts.map