import { Client, Guild, Role } from "discord.js";
import { SystemsManager } from "./SystemsManager";
import { Options } from "../constants";
import { Logger } from "./Logger";
import { Utils } from "./Utils";

export declare interface AutoRole {
  client: Client;
  options: Options;

  systems: SystemsManager;
  utils: Utils;
  logger: Logger;
}

export class AutoRole {
  constructor(client: Client, options: Options);

  get(guild: Guild): Promise<Role | null>;
  set(guild: Guild, role: Role): Promise<boolean>;
  delete(guild: Guild): Promise<boolean>;
}
