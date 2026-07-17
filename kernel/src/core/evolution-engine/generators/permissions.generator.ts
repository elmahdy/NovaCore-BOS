export class PermissionsGenerator {
  generate(genome: any): any {
    return {
      type: 'permissions',
      roles: ['admin', 'user', 'viewer'],
      permissions: [
        `${genome.moduleName}:create`,
        `${genome.moduleName}:read`,
        `${genome.moduleName}:update`,
        `${genome.moduleName}:delete`,
      ],
    };
  }
}
