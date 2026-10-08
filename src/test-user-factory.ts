import { randomBytes, randomInt, randomUUID } from 'node:crypto';

export interface TestUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const firstNames = ['Alba', 'Camila', 'Daniela', 'Lucía', 'Mariana', 'Sofía'];
const lastNames = ['Andrade', 'Cárdenas', 'Londoño', 'Mejía', 'Restrepo', 'Vargas'];

function pick<T>(values: readonly T[]): T {
  return values[randomInt(values.length)];
}

export function createRandomTestUser(): TestUser {
  return {
    id: `99${randomInt(0, 100_000_000).toString().padStart(8, '0')}`,
    firstName: pick(firstNames),
    lastName: pick(lastNames),
    email: `qa-${randomUUID()}@example.invalid`,
    password: `Qa!${randomBytes(16).toString('hex')}9a`,
  };
}
