import { Client, GuildMember, Message } from "discord.js";
import {
  Options,
  GuildData,
  WarnsData,
  MutesData,
  MuteTypes,
} from "../constants";

import { Base } from "./Base";
import { Logger } from "./Logger";
import { MuteManager } from "./MuteManager";
import { WarnManager } from "./WarnManager";

export declare interface Moderation {
  client: Client;
  options: Options;

  mutes: MuteManager;
  warns: WarnManager;
  logger: Logger;

  isReady: boolean;
}

export declare class Moderation extends Base {
  constructor(client: Client, options: Options);

  mute(
    type: MuteTypes,
    message: Message,
    member: GuildMember,
    reason?: string,
    time?: string
  ): Promise<MutesData>;
  unmute(member: GuildMember): Promise<MutesData>;

  warn(
    message: Message,
    member: GuildMember,
    reason?: string
  ): Promise<WarnsData>;
  unwarn(member: GuildMember): Promise<WarnsData>;
  allWarns(member: GuildMember): Promise<WarnsData[] | null>;
}
