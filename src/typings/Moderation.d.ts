import { Client, GuildMember, Interaction, Message } from "discord.js";
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
import { Systems } from "./Systems";
import { AutoRole } from "./AutoRole";
import { AntiSpam } from "./AntiSpam";

export declare interface Moderation {
  client: Client;
  options: Options;

  utils: Utils;
  mutes: MuteManager;
  warns: WarnManager;
  systems: Systems;
  autoRole: AutoRole;
  antiSpam: AntiSpam;
  logger: Logger;

  isReady: boolean;
}

export declare class Moderation extends Base {
  constructor(client: Client, options: Options);

  mute(
    type: MuteTypes,
    message: Message | Interaction,
    member: GuildMember,
    reason?: string,
    time?: number
  ): Promise<MutesData>;

  unmute(member: GuildMember): Promise<MutesData>;

  warn(
    message: Message | Interaction,
    member: GuildMember,
    reason?: string
  ): Promise<WarnsData>;

  unwarn(member: GuildMember): Promise<WarnsData>;

  allWarns(member: GuildMember): Promise<WarnsData[] | null>;
}
