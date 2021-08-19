export interface MutesData {
    id: number
    type: string
    guildID: string
    memberID: string
    moderatorID: string
    channelID: string
    reason: string
    time?: number
    unmutedAt?: number
}
