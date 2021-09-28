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

  set(id: string, value: any): boolean;
  setProp(id: string, key: string, value: any): boolean;
  push(id: string, data: any): boolean;
  get(id: string, key: string): string | number;
  fetch(id: string): GuildData;
  remove(id: string, key: string, second: string, value: string): any | boolean;
}
