import { Gene } from './index';

export class WorkflowGene implements Gene {
  id = 'workflow';
  name = 'Workflow Gene';
  description = 'Génère les moteurs de workflow et machines à états';
  version = '1.0.0';
  dependencies = ['crud'];
  conflicts: string[] = [];
  capabilities = ['state-machine', 'transitions', 'triggers', 'approvals'];

  generate(context: any): any {
    return {
      services: [`${context.entityName}.workflow.ts`],
      states: context.states || ['draft', 'pending', 'approved', 'rejected'],
      transitions: context.transitions || [],
    };
  }
}
