import { Injectable } from '@nestjs/common';

export interface DualWriteResult {
  postgres: boolean;
  mongodb: boolean;
}

@Injectable()
export class DatabaseEngineService {
  // Double écriture : PostgreSQL (source de vérité) + MongoDB (lecture rapide)
  async dualWrite(collection: string, data: any): Promise<DualWriteResult> {
    const result: DualWriteResult = { postgres: false, mongodb: false };
    try {
      await this.writePostgres(collection, data);
      result.postgres = true;
    } catch (e) {
      result.postgres = false;
    }
    try {
      await this.writeMongo(collection, data);
      result.mongodb = true;
    } catch (e) {
      result.mongodb = false;
    }
    return result;
  }

  private async writePostgres(collection: string, data: any): Promise<void> {
    // Écriture transactionnelle PostgreSQL
    return Promise.resolve();
  }

  private async writeMongo(collection: string, data: any): Promise<void> {
    // Écriture MongoDB (dénormalisée)
    return Promise.resolve();
  }
}
