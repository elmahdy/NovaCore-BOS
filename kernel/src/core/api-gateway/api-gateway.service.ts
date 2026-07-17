import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiGatewayService {
  private routes: Map<string, string> = new Map();

  registerRoute(path: string, target: string): void {
    this.routes.set(path, target);
  }

  resolveRoute(path: string): string | undefined {
    return this.routes.get(path);
  }

  getRoutes(): Record<string, string> {
    return Object.fromEntries(this.routes);
  }
}
