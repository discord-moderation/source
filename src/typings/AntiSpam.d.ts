import { Client, Message } from "discord.js";
import { Options } from "../constants";
import { Logger } from "./Logger";
import { MuteManager } from "./MuteManager";
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

  handle(message: Message): Promise<boolean>;
}
