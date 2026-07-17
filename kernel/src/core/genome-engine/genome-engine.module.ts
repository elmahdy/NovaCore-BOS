import { Module } from '@nestjs/common';
import { GenomeEngineService } from './genome-engine.service';

@Module({
  providers: [GenomeEngineService],
  exports: [GenomeEngineService],
})
export class GenomeEngineModule {}
