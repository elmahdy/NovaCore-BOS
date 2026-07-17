import { Provider } from '@nestjs/common';
import mongoose from 'mongoose';

export const MONGODB_CONNECTION = 'MONGODB_CONNECTION';

export const mongodbProvider: Provider[] = [
  {
    provide: MONGODB_CONNECTION,
    useFactory: async (): Promise<typeof mongoose> => {
      return mongoose.connect(
        process.env.MONGODB_URI ||
          'mongodb://novacore:novacore123@localhost:27017/novacore',
      );
    },
  },
];
