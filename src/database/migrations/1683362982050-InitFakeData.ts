import { MigrationInterface, QueryRunner } from 'typeorm';
import { faker } from '@faker-js/faker';
import { User } from '../../user/entities/user.entity';
import { CryptoCurrencyEnum } from '../../exchanger/enums/crypto-currency.enum';
import { FiatCurrencyEnum } from '../../exchanger/enums/fiat-currency.enum';
import { CryptoAsset } from '../../exchanger/entities/crypto-asset.entity';
import { FiatBalance } from '../../exchanger/entities/fiat-balance.entity';

export class InitFakeData1683362982050 implements MigrationInterface {
  name = 'InitFakeData1683362982050';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = await Promise.all(
      // eslint-disable-next-line prefer-spread
      Array.apply(null, Array(faker.datatype.number({ min: 10, max: 30 }))).map(() =>
        queryRunner.manager.save(User, Object.create({})),
      ),
    );

    await Promise.all(
      users.flatMap(user => [
        queryRunner.manager.insert(CryptoAsset, {
          user,
          sym: CryptoCurrencyEnum.ETH,
          amount: faker.datatype.number({ min: 1, max: 100, precision: 0.01 }).toString(),
        }),
        queryRunner.manager.insert(CryptoAsset, {
          user,
          sym: CryptoCurrencyEnum.XBT,
          amount: faker.datatype.number({ min: 1, max: 100, precision: 0.01 }).toString(),
        }),
        queryRunner.manager.insert(FiatBalance, {
          user,
          sym: faker.helpers.arrayElement(Object.values(FiatCurrencyEnum)),
          amount: '0',
        }),
      ]),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
