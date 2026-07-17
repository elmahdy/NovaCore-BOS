import { Injectable } from '@nestjs/common';
import { GenomeSchema, GeneSchema } from './schema';

@Injectable()
export class GenomeValidator {
  validateStructure(genome: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!genome.moduleName || typeof genome.moduleName !== 'string') {
      errors.push('moduleName is required and must be a string');
    }
    if (!Array.isArray(genome.genes) || genome.genes.length === 0) {
      errors.push('genes must be a non-empty array');
    }

    return { valid: errors.length === 0, errors };
  }

  validateGene(gene: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const required = ['id', 'name', 'version', 'dependencies', 'conflicts'];
    for (const field of required) {
      if (!(field in gene)) {
        errors.push(`Gene missing required field: ${field}`);
      }
    }
    return { valid: errors.length === 0, errors };
  }
}
