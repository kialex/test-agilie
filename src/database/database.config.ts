export default () => ({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USER || 'root',
  password: process.env.POSTGRES_PASSWORD || 'secret',
  database: process.env.POSTGRES_DB || 'agilie',
  logging: ['error'],
  synchronize: false,
  keepConnectionAlive: true,
  migrationsTableName: 'migrations',
  entities: [
    process.env.NODE_ENV === 'production'
      ? `${__dirname}/../**/*.entity.js`
      : `${__dirname}/../**/*.entity.{js,ts}`,
  ],
  migrations: [
    process.env.NODE_ENV === 'production'
      ? `${__dirname}/../database/migrations/*.js`
      : `${__dirname}/../database/migrations/*{.ts,.js}`,
  ],
  migrationsRun: false,
});
