import { CrudGene } from './crud.gene';
import { WorkflowGene } from './workflow.gene';
import { AiGene } from './ai.gene';

export interface Gene {
  id: string;
  name: string;
  description: string;
  version: string;
  dependencies: string[];
  conflicts: string[];
  capabilities: string[];
  generate(context: any): any;
}

export class GeneLibrary {
  private genes: Gene[] = [];

  constructor() {
    this.genes = [new CrudGene(), new WorkflowGene(), new AiGene()];
  }

  getAll(): Gene[] {
    return this.genes;
  }

  getById(id: string): Gene | undefined {
    return this.genes.find((g) => g.id === id);
  }
}

export { CrudGene, WorkflowGene, AiGene };
