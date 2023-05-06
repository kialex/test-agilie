import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';
import { CryptoCurrencyEnum } from '../enums/crypto-currency.enum';
import { User } from '../../user/entities/user.entity';

@Entity()
export class CryptoAsset {
  @PrimaryColumn('varchar')
  sym: CryptoCurrencyEnum;

  @PrimaryGeneratedColumn('uuid')
  userUuid: string;

  @Column('decimal', { nullable: false })
  amount: string;

  @ManyToOne(() => User, user => user.cryptoAssets, { onDelete: 'CASCADE' })
  user: User;
}
