export type MuteTypes = "mute" | "tempmute";

export const ERROR_MESSAGES = {
  INVALID_TYPE: (expected: string | string[], got: any, name?: string) =>
    `Expected ${
      Array.isArray(expected)
        ? expected
            .map((e) => (typeof e === "number" ? e : `'${e}'`))
            .join(" or ")
        : `'${expected}'`
    }${name ? ` for ${name}` : ""}, but got ${
      typeof got === "string"
        ? `'${got}'`
        : typeof got === "number"
        ? got
        : Array.isArray(got)
        ? `Array<${got.length}>`
        : got?.constructor?.name || typeof got
    }`,
  UNDEFINED_VALUE: (expected: string, got: any, name: string) =>
    `Expected '${expected}' for '${name}', but got '${got}'`,
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
