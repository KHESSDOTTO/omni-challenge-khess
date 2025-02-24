import { DataSource } from 'typeorm';

export const databaseProviders = [
  // Main provider
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 3307,
        username: 'root',
        password: '246801996Kk!',
        database: 'omni_challenge_khess',
        entities: [
            __dirname + '/../**/*.entity{.ts,.js}',
        ],
        synchronize: process.env.NODE_ENV === 'dev',
      });

      return dataSource.initialize();
    },
  },
];
