import { Module, Global } from '@nestjs/common';
import { DatabaseEngineService } from './database-engine.service';
import { postgresProvider } from './postgres/postgres.provider';
import { mongodbProvider } from './mongodb/mongodb.provider';

@Global()
@Module({
  providers: [DatabaseEngineService, ...postgresProvider, ...mongodbProvider],
  exports: [DatabaseEngineService],
})
export class DatabaseEngineModule {}
