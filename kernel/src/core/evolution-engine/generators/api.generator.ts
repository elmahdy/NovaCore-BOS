export class ApiGenerator {
  generate(genome: any): any {
    return {
      type: 'api',
      controllers: [`${genome.moduleName}.controller.ts`],
      services: [`${genome.moduleName}.service.ts`],
      dtos: [`create-${genome.moduleName}.dto.ts`, `update-${genome.moduleName}.dto.ts`],
      routes: [
        { method: 'GET', path: `/${genome.moduleName}` },
        { method: 'POST', path: `/${genome.moduleName}` },
      ],
    };
  }
}
