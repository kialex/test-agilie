import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import config from './database.config';

export default new DataSource(config() as PostgresConnectionOptions);
