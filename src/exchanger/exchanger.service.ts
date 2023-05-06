import { Inject, Injectable, Logger } from '@nestjs/common';
// eslint-disable-next-line max-len
import { UnprocessableEntityException } from '@nestjs/common/exceptions/unprocessable-entity.exception';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { FiatCurrencyEnum } from './enums/fiat-currency.enum';
import { CryptoCurrencyEnum } from './enums/crypto-currency.enum';
import { EXCHANGER_SERVICE, ExchangerInterface } from './exchanger.interface';

@Injectable()
export class ExchangerService {
  protected readonly logger: Logger = new Logger(this.constructor.name);
  constructor(
    private readonly dataSource: DataSource,
    @Inject(EXCHANGER_SERVICE) private readonly exchanger: ExchangerInterface,
  ) {}

  /**
   * @param {string} stringPairs
   */
  public async getRates(stringPairs: string): Promise<Record<string, string>> {
    const fiatArray: Array<string> = Object.values(FiatCurrencyEnum);
    const cryptoArray: Array<string> = Object.values(CryptoCurrencyEnum);
    const pairs = stringPairs.split(',');

    const result = new Map();
    for (const pair of pairs) {
      const [cryptoSym, fiatSym] = pair.split('/');
      if (!cryptoArray.includes(cryptoSym) || !fiatArray.includes(fiatSym)) {
        throw new UnprocessableEntityException(`Unsupported pair: ${pair}`);
      }
      result.set(pair, await this.exchanger.getRate(cryptoSym, fiatSym));
    }

    return Object.fromEntries(result);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  public async calculateFiatBalance() {
    const rates = await this.exchanger.getAllRates();
    if (Object.values(rates).length === 0) return;

    const conditions = [];
    for (const cryptoSym in rates) {
      let condition = `WHEN '${cryptoSym}' THEN (CASE fiat_balance.sym`;
      for (const fiatSym in rates[cryptoSym]) {
        condition += ` WHEN '${fiatSym}' THEN '${rates[cryptoSym][fiatSym]}'`;
      }
      condition += " ELSE '0' END)";
      conditions.push(condition);
    }

    this.dataSource
      .query(
        `
        UPDATE fiat_balance
        SET amount = (
            SELECT SUM(amount * (CASE crypto_asset.sym ${conditions.join(' ')} ELSE '0' END)::float)
            FROM crypto_asset
            WHERE crypto_asset."userUuid" = fiat_balance."userUuid")
        `,
      )
      .then(result => {
        const [data, affectedRow] = result;
        this.logger.log(`Users fiat balance has been recalculated. Affected row: ${affectedRow}`);
      })
      .catch(error => {
        this.logger.error(`Error recalculated users fiat balance. Error: ${JSON.stringify(error)}`);
      });
  }
}
