import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer, Consumer } from 'kafkajs';
import { EventEmitter2 } from '@nestjs/event-emitter';

export interface NovaEvent {
  id: string;
  type: string;
  source: string;
  target?: string;
  payload: any;
  timestamp: Date;
  correlationId?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

@Injectable()
export class EventBusService implements OnModuleInit {
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;
  private eventRegistry: Map<string, Set<string>> = new Map();

  constructor(private eventEmitter: EventEmitter2) {
    this.kafka = new Kafka({
      clientId: 'novacore-kernel',
      brokers: process.env.KAFKA_BROKERS?.split(',') || ['kafka:9092'],
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'novacore-kernel-group' });
  }

  async onModuleInit() {
    await this.producer.connect();
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'nova-events', fromBeginning: false });
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const event = JSON.parse(message.value.toString()) as NovaEvent;
        this.eventEmitter.emit(event.type, event);
        this.eventEmitter.emit('*', event);
      },
    });
  }

  async publish(event: NovaEvent): Promise<void> {
    event.id = crypto.randomUUID();
    event.timestamp = new Date();
    await this.producer.send({
      topic: 'nova-events',
      messages: [{ value: JSON.stringify(event) }],
    });
    this.eventEmitter.emit(event.type, event);
  }

  subscribe(eventType: string, handler: (event: NovaEvent) => void): string {
    const id = crypto.randomUUID();
    this.eventEmitter.on(eventType, handler);
    if (!this.eventRegistry.has(eventType)) {
      this.eventRegistry.set(eventType, new Set());
    }
    this.eventRegistry.get(eventType)!.add(id);
    return id;
  }

  routeEvent(event: NovaEvent): string[] {
    const routes: string[] = [];
    if (event.type === 'Invoice.Paid') {
      routes.push('stock-module', 'crm-module', 'analytics-module');
    } else if (event.type === 'Customer.Created') {
      routes.push('crm-module', 'marketing-module', 'notification-module');
    }
    return routes;
  }
}
