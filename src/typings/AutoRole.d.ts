import { Client, Guild, Role } from "discord.js";
import { Options, ReturnObject } from "../constants";
import { SystemsManager } from "./SystemsManager";
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

  get(guild: Guild): Promise<ReturnObject | Role | null>;
  set(guild: Guild, role: Role): Promise<ReturnObject | boolean>;
  delete(guild: Guild): Promise<ReturnObject | boolean>;
}
