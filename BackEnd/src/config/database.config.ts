import * as dotenv from 'dotenv';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { DataSource } from 'typeorm';
import configuration from './configuration';

dotenv.config();
const config = configuration();
export const typeOrmConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  schema: config.database.schema,
  migrationsTableName: 'migration',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
  migrationsRun: process.env.NODE_ENV === 'production',
  migrations: [__dirname + '/../migration/*{.ts,.js}'],
  logging: ['error'],
};
const dataSource = new DataSource(typeOrmConfig);

export default dataSource;
