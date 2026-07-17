export const GenomeSchema = {
  type: 'object',
  required: ['moduleName', 'genes'],
  properties: {
    moduleName: { type: 'string', minLength: 1 },
    genes: {
      type: 'array',
      items: { type: 'string' },
      minItems: 1,
    },
    entityName: { type: 'string' },
  },
};

export const GeneSchema = {
  type: 'object',
  required: ['id', 'name', 'version', 'dependencies', 'conflicts'],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    version: { type: 'string' },
    dependencies: { type: 'array', items: { type: 'string' } },
    conflicts: { type: 'array', items: { type: 'string' } },
  },
};
