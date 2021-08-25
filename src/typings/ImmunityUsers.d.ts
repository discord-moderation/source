import { Client, GuildMember, Guild } from "discord.js";
import { Options, ImmunityUsersData } from "../constants";

import { Logger } from "./Logger";
import { Utils } from "./Utils";

export declare interface ImmunityUsers {
  client: Client;
  options: Options;

  utils: Utils;
  logger: Logger;
}

export declare class ImmunityUsers {
  constructor(client: Client, options: Options);

  add(member: GuildMember): Promise<boolean>;
  delete(member: GuildMember): Promise<boolean>;
  getAll(guild: Guild): Promise<ImmunityUsersData[]>;
}
