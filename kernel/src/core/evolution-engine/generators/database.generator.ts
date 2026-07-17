export class DatabaseGenerator {
  generate(genome: any): any {
    return {
      type: 'database',
      postgres: {
        tables: [`${genome.moduleName}_table`],
        migrations: [`create_${genome.moduleName}.sql`],
      },
      mongodb: {
        collections: [`${genome.moduleName}_collection`],
        schemas: [`${genome.moduleName}.schema.ts`],
      },
    };
  }
}
