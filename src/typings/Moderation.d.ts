// Imports
import { Options, MuteTypes, MutesData, WarnsData } from "../constants";
import { SystemsManager } from "./SystemsManager";
import { GuildSystems } from "./modules/GuildSystems";
import { MuteManager } from "./MuteManager";
import { WarnManager } from "./WarnManager";
import { AutoRole } from "./AutoRole";
import { AntiSpam } from "./AntiSpam";
import { Logger } from "./Logger";
import { Utils } from "./Utils";
import { Base } from "./Base";
import ModeratorError from "./ModeratorError";

// Discord.JS
import { Client, GuildMember, Interaction, Message } from "discord.js";

export interface Moderation {
  client: Client;
  options: Options;

  // Classes and Systems
  utils: Utils;
  mutes: MuteManager;
  warns: WarnManager;
  guildSystems: GuildSystems;
  systems: SystemsManager;
  autoRole: AutoRole;
  antiSpam: AntiSpam;
  logger: Logger;

  // Other
  isReady: boolean;
}

export class Moderation extends Base {
  constructor(client: Client, options: Options);

  private _init(): Promise<boolean>;

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
