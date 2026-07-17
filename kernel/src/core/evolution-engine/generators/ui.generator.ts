export class UiGenerator {
  generate(genome: any): any {
    return {
      type: 'ui',
      pages: [`${genome.moduleName}List.tsx`, `${genome.moduleName}Detail.tsx`],
      components: [`${genome.moduleName}Form.tsx`, `${genome.moduleName}Table.tsx`],
      routes: [`/${genome.moduleName}`],
    };
  }
}
