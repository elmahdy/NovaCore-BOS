import { Gene } from './index';

export class AiGene implements Gene {
  id = 'ai';
  name = 'AI Gene';
  description = 'Ajoute des capacités IA (prédiction, classification, NLP)';
  version = '1.0.0';
  dependencies = ['crud'];
  conflicts: string[] = [];
  capabilities = ['prediction', 'classification', 'nlp', 'recommendation'];

  generate(context: any): any {
    return {
      services: [`${context.entityName}.ai.service.ts`],
      models: context.models || ['prediction-model'],
      endpoints: [
        { method: 'POST', path: `/${context.entityName}/predict` },
        { method: 'POST', path: `/${context.entityName}/classify` },
      ],
    };
  }
}
