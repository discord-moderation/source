export type MuteTypes = "mute" | "tempmute";
export type ActionTypes =
  | "Mute"
  | "TempMute"
  | "UnMute"
  | "Ban"
  | "Kick"
  | "Warn"
  | "UnWarn";

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

export const links: Array<string> = [
  "https://",
  "http://",
  "discord.gg",
  "discord.com",
  ".xyz",
  ".online",
  ".com",
  ".ru",
  ".space",
];

export const defaultOptions: Options = {
  locale: "en-US",
  systems: {
    autoRole: false,
    antiSpam: false,
    antiInvite: false,
    antiJoin: false,
    antiLink: false,
    blacklist: false,
    ghostPing: false,
    logSystem: false,
  },
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
  autoRole: null | string;
  cases: null | number;
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
  locale?: string;

  systems?: ModuleSystems;
}

export interface ModuleSystems {
  autoRole?: boolean;
  antiSpam?: boolean;
  antiJoin?: boolean;
  antiInvite?: boolean;
  antiLink?: boolean;
  blacklist?: boolean;
  ghostPing?: boolean;
  logSystem?: boolean;
}
