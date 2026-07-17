import { Injectable } from '@nestjs/common';
import { DatabaseGenerator } from './generators/database.generator';
import { ApiGenerator } from './generators/api.generator';
import { UiGenerator } from './generators/ui.generator';
import { WorkflowGenerator } from './generators/workflow.generator';
import { PermissionsGenerator } from './generators/permissions.generator';

@Injectable()
export class EvolutionEngineService {
  private databaseGen = new DatabaseGenerator();
  private apiGen = new ApiGenerator();
  private uiGen = new UiGenerator();
  private workflowGen = new WorkflowGenerator();
  private permissionsGen = new PermissionsGenerator();

  evolve(genome: any): GeneratedModule {
    const result = new GeneratedModule();
    result.moduleName = genome.moduleName;

    result.database = this.databaseGen.generate(genome);
    result.api = this.apiGen.generate(genome);
    result.ui = this.uiGen.generate(genome);
    result.workflow = this.workflowGen.generate(genome);
    result.permissions = this.permissionsGen.generate(genome);

    return result;
  }
}

export class GeneratedModule {
  moduleName: string;
  database: any;
  api: any;
  ui: any;
  workflow: any;
  permissions: any;
}
