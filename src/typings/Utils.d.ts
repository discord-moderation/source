import { Client, Guild, GuildMember, Invite, MessageEmbed } from "discord.js";
import { Base } from "./Base";
import {
  ActionTypes,
  GuildData,
  MutesData,
  Options,
  WarnsData,
} from "../constants";
import { MuteManager } from "./MuteManager";
import { Logger } from "./Logger";
import { DBManager } from "./DBManager";

export declare interface Utils {
  client: Client;
  options: Options;

  database: DBManager;
  mutes: MuteManager;
  logger: Logger;
}

export declare class Utils extends Base {
  constructor(client: Client, options: Options);

  checkMute(member: GuildMember): Promise<boolean>;

  getGuild(guild: Guild): Promise<GuildData>;
  createGuild(guild: Guild): Promise<boolean>;
  setData(guild: Guild, newData: GuildData): Promise<boolean>;

  logEmbed(
    action: ActionTypes,
    member: GuildMember,
    muteData?: MutesData | null,
    warnData?: WarnsData | null
  ): Promise<MessageEmbed>;

  checkFile(): Promise<boolean>;
  checkMutes(): Promise<boolean>;
  checkUpdate(): Promise<any>;
  checkOptions(): Promise<boolean>;
  checkImmunity(target: GuildMember | Invite): Promise<boolean>;

  wait(ms: number): Promise<unknown>;
}
