import { Module, Global } from '@nestjs/common';
import { EventBusService } from './event-bus.service';
import { eventBusProvider } from './event-bus.provider';

@Global()
@Module({
  providers: [EventBusService, ...eventBusProvider],
  exports: [EventBusService],
})
export class EventBusModule {}
