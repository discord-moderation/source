import {
  Client,
  Guild,
  GuildMember,
  Interaction,
  Message,
  Role,
} from "discord.js";
import { Options, MuteTypes, MutesData } from "../constants";
import { Logger } from "./Logger";
import { Utils } from "./Utils";
import { Base } from "./Base";

export declare interface MuteManager {
  client: Client;
  options: Options;

  logger: Logger;
  utils: Utils;
}

export declare class MuteManager extends Base {
  constructor(client: Client, options: Options);

  setRole(guild: Guild, role: Role): Promise<boolean>;
  getRole(guild: Guild): Promise<null | Role>;
  getMute(member: GuildMember): Promise<MutesData | null>;

  create(
    type: MuteTypes,
    message: Message | Interaction,
    member: GuildMember,
    reason?: string,
    time: number
  ): Promise<MutesData>;
  delete(member: GuildMember): Promise<MutesData>;

  handleUtilsMute(member: GuildMember): Promise<boolean>;
  private handleMute(
    guild: Guild,
    member: GuildMember,
    time: number,
    muteData: MutesData
  ): Promise<null | boolean>;
}
