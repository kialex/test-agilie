import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import config from './database.config';

@Global()
@Module({
  imports: [TypeOrmModule.forRoot(config() as PostgresConnectionOptions)],
})
export class DatabaseModule {}
