import { Client, Guild, GuildMember } from "discord.js";
import { Base } from "./Base";
import { GuildData, Options } from "../constants";
import { MuteManager } from "./MuteManager";
import { Logger } from "./Logger";

export declare interface Utils {
  client: Client;
  options: Options;

  mutes: MuteManager;
  logger: Logger;
}

export declare class Utils extends Base {
  constructor(client: Client, options: Options);

  checkMute(member: GuildMember): Promise<boolean>;

  getGuild(guild: Guild): Promise<GuildData>;
  createGuild(guild: Guild): Promise<boolean>;
  setData(guild: Guild, newData: GuildData): Promise<boolean>;

  checkFile(): Promise<boolean>;
  checkMutes(): Promise<boolean>;

  wait(ms: number): Promise<unknown>;
}
