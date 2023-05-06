import { CryptoCurrencyEnum } from '../enums/crypto-currency.enum';
import { FiatCurrencyEnum } from '../enums/fiat-currency.enum';

export type rateListType = Record<CryptoCurrencyEnum, Record<FiatCurrencyEnum, string>>;
