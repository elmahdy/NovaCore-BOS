export class WorkflowGenerator {
  generate(genome: any): any {
    const hasWorkflow = genome.genes && (genome.genes.has ? genome.genes.has('workflow') : false);
    if (!hasWorkflow) return { type: 'workflow', enabled: false };
    return {
      type: 'workflow',
      enabled: true,
      stateMachine: `${genome.moduleName}.workflow.ts`,
      states: ['draft', 'pending', 'approved', 'rejected'],
    };
  }
}
