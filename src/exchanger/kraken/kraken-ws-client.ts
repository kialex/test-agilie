import { Logger } from '@nestjs/common';
import * as WebSocket from 'ws';
import { rateListType } from '../types/rate-list.type';
import { CryptoCurrencyEnum } from '../enums/crypto-currency.enum';
import { FiatCurrencyEnum } from '../enums/fiat-currency.enum';

export class KrakenWsClient {
  protected wsClient: WebSocket;
  protected readonly logger: Logger = new Logger(this.constructor.name);

  private isReady = false;
  private rates: rateListType | Record<string, never> = {};

  /**
   * Connect to Kraken WS client
   *
   * @param {string} url Kraken WS host
   * @return {Promise<rateListType>}
   */
  public connect(url: string): Promise<rateListType> {
    return new Promise((resolve, reject) => {
      this.wsClient = new WebSocket(url);
      const waitingInterval = setInterval(() => {
        this.logger.warn(
          // eslint-disable-next-line max-len
          '|====================  WAITING NESASSARY RESULTS FROM KRAKEN ==========================|',
        );
      }, 2000);

      const breakTimeout = setTimeout(() => {
        this.wsClient.close();
        this.logger.error(
          // eslint-disable-next-line max-len
          '|====================  WAITING TIME IS EXPIRED ==========================|',
        );
        clearInterval(waitingInterval);
        reject('Error connect to Kraken service');
      }, 30000);

      this.wsClient.on('open', this.onOpen.bind(this));
      this.wsClient.on('close', this.onClose.bind(this));
      this.wsClient.on('error', error => {
        this.onError(error);
        reject(error);
      });

      this.wsClient.on('message', message => {
        this.onMessage(message);
        if (!this.isReady && this.isNecessaryDataCollected()) {
          this.isReady = true;
          clearTimeout(breakTimeout);
          clearInterval(waitingInterval);
          resolve(this.rates as rateListType);
          this.logger.log(
            '|====================  KRAKEN WS CLIENT IS READY  ==========================|',
          );
          console.table(this.rates);
        }
      });
    });
  }

  /**
   * @return {void}
   */
  public disconnect(): void {
    if (this.wsClient) {
      this.wsClient.close();
    }
    this.isReady = false;
    this.logger.log(
      '|====================  KRAKEN WS CLIENT DISCONNECTED  ==========================|',
    );
  }

  /**
   * @return {rateListType}
   */
  public getRates(): rateListType {
    return this.rates as rateListType;
  }

  /**
   * @protected
   */
  protected isNecessaryDataCollected(): boolean {
    return (
      Object.values(CryptoCurrencyEnum).find(
        symName =>
          !(symName in this.rates) ||
          Object.keys(this.rates[symName]).length !== Object.values(FiatCurrencyEnum).length,
      ) === undefined
    );
  }

  /**
   * @param message
   * @protected
   */
  protected onMessage(message) {
    message = JSON.parse(message.toString());
    if (!Array.isArray(message)) return;

    const [channelID, [rate], channelName, pair] = message;

    if (channelName !== 'spread') return;

    const [cryptoSym, fiatSym] = pair.split('/');

    this.rates[cryptoSym] = {
      ...this.rates[cryptoSym],
      ...{ [fiatSym]: rate },
    };
  }

  /**
   * @protected
   */
  protected onOpen() {
    this.logger.log(
      '|====================  KRAKEN WS CONNECTION OPENED  ==========================|',
    );
    this.wsClient.send(
      JSON.stringify({
        event: 'subscribe',
        subscription: { name: 'spread' },
        pair: Object.values(CryptoCurrencyEnum).flatMap(cryptoSym =>
          Object.values(FiatCurrencyEnum).map(fiatSym => `${cryptoSym}/${fiatSym}`),
        ),
      }),
    );
  }

  /**
   * @protected
   */
  protected onClose() {
    this.logger.log(
      '|====================  KRAKEN WS CONNECTION CLOSED  ==========================|',
    );
  }

  /**
   * @param error
   * @protected
   */
  protected onError(error: unknown) {
    this.logger.error(
      '|====================  KRAKEN WS CONNECTION ERROR  ==========================|',
    );
    this.wsClient.close();
  }
}
