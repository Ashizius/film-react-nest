export interface AppDatabaseCredentials {
  username: string;
  password: string;
}

export interface AppConfigDatabase {
  host: string;
  type: 'postgres';
  port: number;
  database: string;
  credentials: AppDatabaseCredentials;
}

export interface AppConfig {
  database: AppConfigDatabase;
  port: number;
}

export default () =>
  <AppConfig>{
    port: parseInt(process.env.PORT) || 3000,
    database: {
      host: process.env.DATABASE_HOST || 'localhost',
      type: process.env.DATABASE_DRIVER || 'postgres',
      port: parseInt(process.env.DATABASE_PORT) || 5432,
      database: process.env.DATABASE_DATABASE || 'prac',
      credentials: {
        username: process.env.DATABASE_USERNAME || 'prac',
        password: process.env.DATABASE_PASSWORD || 'prac',
      },
    },
  };
