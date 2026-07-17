import { GenomeEngineService } from '../../src/core/genome-engine/genome-engine.service';

describe('GenomeEngineService', () => {
  let service: GenomeEngineService;

  beforeEach(() => {
    service = new GenomeEngineService();
  });

  it('should create a genome with selected genes', () => {
    const genome = service.createGenome('test-module', ['crud']);
    expect(genome.moduleName).toBe('test-module');
    expect(genome.genes.has('crud')).toBe(true);
  });

  it('should auto-resolve dependencies (workflow requires crud)', () => {
    const genome = service.createGenome('test-module', ['workflow']);
    expect(genome.genes.has('crud')).toBe(true);
  });

  it('should validate a valid genome', () => {
    const genome = service.createGenome('test-module', ['crud']);
    const result = service.validateGenome(genome);
    expect(result.valid).toBe(true);
  });
});
