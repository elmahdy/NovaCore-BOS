import { Provider } from '@nestjs/common';
import { Kafka } from 'kafkajs';

export const KAFKA_CLIENT = 'KAFKA_CLIENT';

export const eventBusProvider: Provider[] = [
  {
    provide: KAFKA_CLIENT,
    useFactory: () => {
      return new Kafka({
        clientId: 'novacore-kernel',
        brokers: process.env.KAFKA_BROKERS?.split(',') || ['kafka:9092'],
      });
    },
  },
];
