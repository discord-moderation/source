import { Client, Guild, GuildMember, Invite } from "discord.js";
import { Options, GuildData, defaultOptions } from "../constants";
import { Logger } from "./Logger";
import { Base } from "./Base";
import { DBManager } from "./DBManager";

export declare interface Utils {
  client: Client;
  options: Options;

  database: DBManager;
  logger: Logger;
}

export declare class Utils extends Base {
  constructor(client: Client, options: Options);

  checkMute(member: GuildMember): Promise<boolean>;

  getGuild(guild: Guild): Promise<GuildData>;
  createGuild(guild: Guild): Promise<GuildData>;
  setData(guild: Guild, newData: GuildData): Promise<boolean>;

  checkMutes(): Promise<boolean>;
  checkOptions(): Promise<boolean>;
  checkImmunity(target: GuildMember | Invite): Promise<boolean>;

  wait(ms: number): Promise<unknown>;
}
