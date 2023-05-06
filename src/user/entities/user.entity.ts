import {
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CryptoAsset } from '../../exchanger/entities/crypto-asset.entity';
import { FiatBalance } from '../../exchanger/entities/fiat-balance.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => CryptoAsset, cryptoAsset => cryptoAsset.user)
  cryptoAssets: CryptoAsset[];

  @OneToMany(() => FiatBalance, fiatBalance => fiatBalance.user)
  fiatBalance: FiatBalance[];
}
