import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventBusModule } from './core/event-bus/event-bus.module';
import { GenomeEngineModule } from './core/genome-engine/genome-engine.module';
import { EvolutionEngineModule } from './core/evolution-engine/evolution-engine.module';
import { ApiGatewayModule } from './core/api-gateway/api-gateway.module';
import { DatabaseEngineModule } from './core/database-engine/database-engine.module';
import { CellManagerModule } from './core/cell-manager/cell-manager.module';
import { UsersModule } from './modules/users/users.module';
import { StaffModule } from './modules/staff/staff.module';
import { EventsModule } from './modules/events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot({ wildcard: true }),
    EventBusModule,
    GenomeEngineModule,
    EvolutionEngineModule,
    ApiGatewayModule,
    DatabaseEngineModule,
    CellManagerModule,
    UsersModule,
    StaffModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
