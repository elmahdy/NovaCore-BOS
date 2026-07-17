import { Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';

export const POSTGRES_DATA_SOURCE = 'POSTGRES_DATA_SOURCE';

export const postgresProvider: Provider[] = [
  {
    provide: POSTGRES_DATA_SOURCE,
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
        username: process.env.POSTGRES_USER || 'novacore',
        password: process.env.POSTGRES_PASSWORD || 'novacore123',
        database: process.env.POSTGRES_DB || 'novacore',
        entities: [__dirname + '/../../../**/*.entity{.ts,.js}'],
        synchronize: process.env.NODE_ENV !== 'production',
      });
      return dataSource;
    },
  },
];
