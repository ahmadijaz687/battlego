import { SCHEMA_SQL } from './schema';

export interface Migration {
  version: number;
  description: string;
  statements: string[];
}

export const MIGRATIONS: Migration[] = [
  {
    version: 1,
    description: 'Initial schema — 68 tables',
    statements: [SCHEMA_SQL],
  },
];
