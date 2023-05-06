import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { FiatCurrencyEnum } from '../enums/fiat-currency.enum';

@Entity()
export class FiatBalance {
  @PrimaryColumn('varchar')
  sym: FiatCurrencyEnum;

  @PrimaryGeneratedColumn('uuid')
  userUuid: string;

  @Column('decimal', { nullable: false })
  amount: string;

  @ManyToOne(() => User, user => user.fiatBalance, { onDelete: 'CASCADE' })
  user: User;
}
