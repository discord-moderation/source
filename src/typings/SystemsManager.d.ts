import { AvaliableSystems, ModuleSystems, Options } from "../constants";
import { Client, Guild } from "discord.js";
import { Logger } from "./Logger";
import { Utils } from "./Utils";
import { Base } from "./Base";

export declare interface SystemsManager {
  client: Client;
  options: Options;

  utils: Utils;
  logger: Logger;
}

export declare class SystemsManager extends Base {
  constructor(client: Client, options: Options);

  enable(guild: Guild, system: AvaliableSystems): Promise<boolean>;
  disable(guild: Guild, system: AvaliableSystems): Promise<boolean>;
  status(guild: Guild, system: AvaliableSystems): Promise<boolean>;
  all(guild: Guild): Promise<ModuleSystems>;
}
