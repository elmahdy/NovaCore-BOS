import { Gene } from './index';

export class CrudGene implements Gene {
  id = 'crud';
  name = 'CRUD Gene';
  description = 'Génère les opérations Create, Read, Update, Delete';
  version = '1.0.0';
  dependencies: string[] = [];
  conflicts: string[] = [];
  capabilities = ['create', 'read', 'update', 'delete', 'list'];

  generate(context: any): any {
    return {
      controllers: [`${context.entityName}.controller.ts`],
      services: [`${context.entityName}.service.ts`],
      entities: [`${context.entityName}.entity.ts`],
      endpoints: [
        { method: 'POST', path: `/${context.entityName}` },
        { method: 'GET', path: `/${context.entityName}` },
        { method: 'GET', path: `/${context.entityName}/:id` },
        { method: 'PATCH', path: `/${context.entityName}/:id` },
        { method: 'DELETE', path: `/${context.entityName}/:id` },
      ],
    };
  }
}
