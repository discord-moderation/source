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
  dbPath: "./",
  locale: "en-US",
  defaultSystems: {
    autoRole: false,
    antiSpam: false,
    antiInvite: false,
    antiJoin: false,
    antiLink: false,
    ghostPing: false,
  },
};

export interface Events {
  muteMember: (data: MutesData) => void;
  unmuteMember: (data: MutesData) => void;

  warnKick: (data: WarnsData) => void;
  warnMute: (data: WarnsData) => void;
  warnAdd: (data: WarnsData) => void;
  warnRemove: (data: WarnsData) => void;
}

export interface GuildData {
  guildID: string;
  muteRole: null | string;
  autoRole: null | string;
  warns: WarnsData[];
  mutes: MutesData[];
  immunityUsers: ImmunityUsersData[];
  systems: ModuleSystems;
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
  dbPath: string;
  locale?: string;
  defaultSystems?: ModuleSystems;
}

export interface ModuleSystems {
  autoRole?: boolean;
  antiSpam?: boolean;
  antiJoin?: boolean;
  antiInvite?: boolean;
  antiLink?: boolean;
  ghostPing?: boolean;
}

export interface ReturnObject {
  status: boolean;
  message?: string;
}

export type AvaliableSystems =
  | "autoRole"
  | "antiSpam"
  | "antiInvite"
  | "antiJoin"
  | "antiLink"
  | "ghostPing";
