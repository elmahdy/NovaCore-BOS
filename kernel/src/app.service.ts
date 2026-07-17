import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInfo() {
    return {
      name: 'NovaCore BOS Kernel',
      version: '3.0.0',
      description: 'ADN du système - moteur de génération et orchestration',
    };
  }

  getHealth() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
