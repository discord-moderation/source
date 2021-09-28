import { Client, GuildMember, Message } from "discord.js";
import { Base } from "./Base";
import { Logger } from "./Logger";
import { MuteManager } from "./MuteManager";
import { Utils } from "./Utils";
import { Options, WarnsData } from "../constants";

export declare interface WarnManager {
  client: Client;
  options: Options;

  mutes: MuteManager;
  utils: Utils;
  logger: Logger;
}

export declare class WarnManager extends Base {
  constructor(client: Client, options: Options);

  getWarn(member: GuildMember): Promise<WarnsData | null>;

  create(
    message: Message | Interaction,
    member: GuildMember,
    reason: string
  ): Promise<WarnsData>;
  delete(member: GuildMember): Promise<WarnsData>;
  all(member: GuildMember): Promise<WarnsData[] | null>;
}
