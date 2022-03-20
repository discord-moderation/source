import { Options, ReturnObject } from "../constants";
import { Client, Message } from "discord.js";
import { MuteManager } from "./MuteManager";
import { Logger } from "./Logger";
import { Utils } from "./Utils";

interface userMap {
  msgCount: number;
  lastMessage: Message;
  timer: NodeJS.Timeout;
}

export declare interface AntiSpam {
  client: Client;
  options: Options;

  mutes: MuteManager;
  utils: Utils;
  logger: Logger;

  usersMap: Map<string, userMap>;
}

export class AntiSpam {
  constructor(client: Client, options: Options);

  handle(message: Message): Promise<ReturnObject | boolean>;
}
