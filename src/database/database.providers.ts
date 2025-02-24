import { DataSource } from 'typeorm';

export const databaseProviders = [
  // Main provider
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      if (process.env.DATABASE_URL) {
        const dataSource = new DataSource({
          type: 'postgres',
          url: process.env.DATABASE_URL,
          ssl: {
            rejectUnauthorized: false // Required for Render Postgres
          },
          entities: [
            __dirname + '/../**/*.entity{.ts,.js}',
          ],
          synchronize: true, // Change to false and use migrations in production
        });
        
        return dataSource.initialize();
      } else {
        const dataSource = new DataSource({
          type: process.env.DB_TYPE as 'postgres' | 'mysql',
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE_NAME,
          entities: [
              __dirname + '/../**/*.entity{.ts,.js}',
          ],
          synchronize: true, // Alterar no futuro (produção) - feito somente para demonstração
        });

        return dataSource.initialize();
      }

    },
  },
];
