import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private requests: Map<string, { count: number; resetTime: number }> = new Map();
  private readonly limit = 100;
  private readonly windowMs = 60000;

  use(req: Request, res: Response, next: NextFunction) {
    const key = req.ip || 'unknown';
    const now = Date.now();
    const record = this.requests.get(key);

    if (!record || now > record.resetTime) {
      this.requests.set(key, { count: 1, resetTime: now + this.windowMs });
      return next();
    }

    if (record.count >= this.limit) {
      return res.status(429).json({ message: 'Too many requests' });
    }

    record.count++;
    next();
  }
}
