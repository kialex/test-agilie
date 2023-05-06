import { Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { ExchangerInterface } from '../exchanger.interface';
import { CryptoCurrencyEnum } from '../enums/crypto-currency.enum';
import { FiatCurrencyEnum } from '../enums/fiat-currency.enum';
import { rateListType } from '../types/rate-list.type';
import { KrakenWsClient } from './kraken-ws-client';
import { KrakenConfig } from './kraken-config';

@Injectable()
export class KrakenService implements ExchangerInterface, OnModuleInit, OnApplicationShutdown {
  protected krakenWsClient: KrakenWsClient;

  constructor(private readonly config: KrakenConfig) {}

  /**
   * @inheritDoc
   */
  public getRate(cryptoSym: CryptoCurrencyEnum, fiatSym: FiatCurrencyEnum): Promise<string> {
    const rates = this.krakenWsClient.getRates();
    if (!rates[cryptoSym]) throw new Error(`Crypto sym is not found: ${cryptoSym}`);

    if (!rates[cryptoSym][fiatSym]) throw new Error(`Fiat sym is not found: ${fiatSym}`);

    return Promise.resolve(rates[cryptoSym][fiatSym]);
  }

  /**
   * @inheritDoc
   */
  public getAllRates(): Promise<rateListType> {
    return Promise.resolve(this.krakenWsClient.getRates());
  }

  /**
   * @inheritDoc
   */
  async onModuleInit(): Promise<void> {
    this.krakenWsClient = new KrakenWsClient();
    await this.krakenWsClient.connect(this.config.host);
  }

  /**
   * @inheritDoc
   */
  async onApplicationShutdown(signal?: string): Promise<void> {
    if (this.krakenWsClient) await this.krakenWsClient.disconnect();
  }
}
