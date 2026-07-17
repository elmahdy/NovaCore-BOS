import { Module } from '@nestjs/common';
import { EvolutionEngineService } from './evolution-engine.service';
import { GenomeEngineModule } from '../genome-engine/genome-engine.module';

@Module({
  imports: [GenomeEngineModule],
  providers: [EvolutionEngineService],
  exports: [EvolutionEngineService],
})
export class EvolutionEngineModule {}
