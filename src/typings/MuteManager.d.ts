import { Client, Guild, GuildMember, Message, Role } from "discord.js";
import { Base } from "./Base";
import { Utils } from "./Utils";
import { MutesData, MuteTypes, Options } from "../constants";

export declare interface MuteManager {
  client: Client;
  options: Options;

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
