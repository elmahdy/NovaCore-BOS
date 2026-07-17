import { Injectable } from '@nestjs/common';
import { K8sService } from './k8s/k8s.service';

export interface Cell {
  name: string;
  image: string;
  replicas: number;
  status: 'pending' | 'running' | 'stopped' | 'error';
}

@Injectable()
export class CellManagerService {
  private cells: Map<string, Cell> = new Map();

  constructor(private k8sService: K8sService) {}

  // Différenciation cellulaire : déployer une nouvelle cellule (microservice)
  async spawnCell(name: string, image: string, replicas = 1): Promise<Cell> {
    const cell: Cell = { name, image, replicas, status: 'pending' };
    await this.k8sService.deploy(name, image, replicas);
    cell.status = 'running';
    this.cells.set(name, cell);
    return cell;
  }

  async killCell(name: string): Promise<void> {
    await this.k8sService.delete(name);
    this.cells.delete(name);
  }

  async scaleCell(name: string, replicas: number): Promise<Cell | undefined> {
    const cell = this.cells.get(name);
    if (!cell) return undefined;
    await this.k8sService.scale(name, replicas);
    cell.replicas = replicas;
    return cell;
  }

  listCells(): Cell[] {
    return Array.from(this.cells.values());
  }
}
