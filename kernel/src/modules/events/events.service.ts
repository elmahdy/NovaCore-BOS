import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventEntity } from './event.entity';
import { EventBusService, NovaEvent } from '../../core/event-bus/event-bus.service';

@Injectable()
export class EventsService {
  private events: EventEntity[] = [];

  constructor(private eventBus: EventBusService) {}

  async emit(event: NovaEvent): Promise<void> {
    await this.eventBus.publish(event);
    this.store(event);
  }

  @OnEvent('*')
  handleAllEvents(event: NovaEvent) {
    this.store(event);
  }

  private store(event: NovaEvent) {
    this.events.push({
      id: event.id || crypto.randomUUID(),
      type: event.type,
      source: event.source,
      target: event.target,
      payload: event.payload,
      correlationId: event.correlationId,
      priority: event.priority || 'medium',
      timestamp: event.timestamp || new Date(),
    });
  }

  findAll(): EventEntity[] {
    return this.events;
  }
}
