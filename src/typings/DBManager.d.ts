import { Client } from "discord.js";
import { GuildData, Options } from "../constants";
import { Logger } from "./Logger";
import Enmap from "enmap";

export declare interface DBManager {
  client: Client;
  options: Options;

  database: Enmap;
  logger: Logger;
}

export declare class DBManager {
  constructor(client: Client, options: Options);

  set(id: string, value: any): Promise<boolean>;
  setProp(id: string, key: string, value: any): Promise<boolean>;
  push(id: string, data: any): Promise<boolean>;
  get(id: string, key: string): Promise<string | number>;
  fetch(id: string): Promise<GuildData>;
  remove(
    id: string,
    key: string,
    second: string,
    value: string
  ): Promise<any | boolean>;
}
