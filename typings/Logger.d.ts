export = Logger;

declare class Logger {
    log(...message): void;
    warn(...message): void;
    error(...message): void;
}