import { Events } from "../constants";

export declare class Base {
  public on<K extends keyof Events>(
    event: K,
    listener: (...args: Events[K]) => void
  ): this;

  public once<K extends keyof Events>(
    event: K,
    listener: (...args: Events[K]) => void
  ): this;

  public emit<K extends keyof Events>(event: K, ...args: Events[K]): boolean;
}
