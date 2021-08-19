export = Utils;

declare class Utils {
    public path: string;
    public logger: Logger;
    
    constructor(path: string);

    createGuild(guild: Guild): void;
    setMuteRole(role: Role): void;
}

import { Guild, Role } from "discord.js";
import Logger from "./Logger";