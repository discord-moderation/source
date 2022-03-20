import { Client, GuildMember, Interaction, Message } from "discord.js";
import { GuildData, Options, WarnsData } from "../constants";
import { MuteManager } from "./MuteManager";
import { Logger } from "./Logger";
import { Utils } from "./Utils";
import { Base } from "./Base";

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

  private _handle(
    message: Message | Interaction,
    member: GuildMember,
    data: GuildData,
    warnData: WarnsData
  ): Promise<boolean>;
}
