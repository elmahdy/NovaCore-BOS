import { Injectable } from '@nestjs/common';
import { Gene } from './genes';

@Injectable()
export class GenomeEngineService {
  private genes: Map<string, Gene> = new Map();

  constructor() {
    // Charger tous les gènes
    const geneLibrary = new (require('./genes').GeneLibrary)();
    geneLibrary.getAll().forEach((gene: Gene) => {
      this.genes.set(gene.id, gene);
    });
  }

  createGenome(moduleName: string, selectedGenes: string[]): ModuleGenome {
    const genome = new ModuleGenome();
    genome.moduleName = moduleName;
    for (const geneId of selectedGenes) {
      const gene = this.genes.get(geneId);
      if (!gene) throw new Error(`Gene ${geneId} not found`);
      for (const conflict of gene.conflicts) {
        if (selectedGenes.includes(conflict)) {
          throw new Error(`Conflict: ${geneId} conflicts with ${conflict}`);
        }
      }
      for (const dep of gene.dependencies) {
        if (!selectedGenes.includes(dep) && !genome.genes.has(dep)) {
          const depGene = this.genes.get(dep);
          if (depGene) genome.genes.set(dep, depGene);
        }
      }
      genome.genes.set(geneId, gene);
    }
    return genome;
  }

  validateGenome(genome: ModuleGenome): ValidationResult {
    const errors: string[] = [];
    for (const [id, gene] of genome.genes) {
      for (const dep of gene.dependencies) {
        if (!genome.genes.has(dep)) {
          errors.push(`Missing dependency: ${id} requires ${dep}`);
        }
      }
      for (const conflict of gene.conflicts) {
        if (genome.genes.has(conflict)) {
          errors.push(`Conflict: ${id} conflicts with ${conflict}`);
        }
      }
    }
    return { valid: errors.length === 0, errors };
  }
}

export class ModuleGenome {
  moduleName: string;
  genes: Map<string, Gene> = new Map();
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}
