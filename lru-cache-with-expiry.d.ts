/**
 * Mnemonist LRUCacheWithExpiry Typings
 * =====================================
 */
import LRUCacheWithDelete from './lru-cache-with-delete';

export interface Logger {
  trace(message: string, story: any): void
  debug(message: string, story: any): void
  info(message:  string, story: any): void
  warn(message:  string, story: any): void
  error(message: string, story: any): void
}

export default class LRUCacheWithExpiry<K, V> extends LRUCacheWithDelete<K, V> {

  expire(): void;

  monitor(interval: number, options: {
    logger: Logger,
    didError: (err: Error, inst: LRUCacheWithExpiry<K, V>) => boolean,
    didExpire: (inst: LRUCacheWithExpiry<K, V>, begT: number) => void,
  }): void;
}
