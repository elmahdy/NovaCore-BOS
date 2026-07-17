import { Controller, Get, Post, Body } from '@nestjs/common';
import { EventsService } from './events.service';
import { NovaEvent } from '../../core/event-bus/event-bus.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async emit(@Body() event: NovaEvent) {
    await this.eventsService.emit(event);
    return { status: 'published' };
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }
}
