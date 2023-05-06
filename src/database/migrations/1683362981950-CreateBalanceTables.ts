import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBalanceTables1683362981950 implements MigrationInterface {
  name = 'CreateBalanceTables1683362981950';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      // eslint-disable-next-line max-len
      `CREATE TABLE "crypto_asset" ("sym" character varying NOT NULL, "userUuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric NOT NULL, CONSTRAINT "PK_9c2ac1a91e3f773d2b33b3a89d4" PRIMARY KEY ("sym", "userUuid"))`,
    );
    await queryRunner.query(
      // eslint-disable-next-line max-len
      `CREATE TABLE "fiat_balance" ("sym" character varying NOT NULL, "userUuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric NOT NULL, CONSTRAINT "PK_12a16fc551e0e6be1659bbcc3c3" PRIMARY KEY ("sym", "userUuid"))`,
    );
    await queryRunner.query(
      // eslint-disable-next-line max-len
      `ALTER TABLE "crypto_asset" ADD CONSTRAINT "FK_1f2c96c4b7fc5e9d25d960befe4" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      // eslint-disable-next-line max-len
      `ALTER TABLE "fiat_balance" ADD CONSTRAINT "FK_8d74dc3dc8479a13f557c6aead8" FOREIGN KEY ("userUuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "fiat_balance" DROP CONSTRAINT "FK_8d74dc3dc8479a13f557c6aead8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "crypto_asset" DROP CONSTRAINT "FK_1f2c96c4b7fc5e9d25d960befe4"`,
    );
    await queryRunner.query(`DROP TABLE "fiat_balance"`);
    await queryRunner.query(`DROP TABLE "crypto_asset"`);
  }
}
