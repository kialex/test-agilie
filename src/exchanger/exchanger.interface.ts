import { rateListType } from './types/rate-list.type';

export const EXCHANGER_SERVICE = Symbol('EXCHANGER_SERVICE');

export interface ExchangerInterface {
  getRate(fSym: string, tSym: string): number | Promise<string>;

  getAllRates(): Promise<rateListType>;
}
