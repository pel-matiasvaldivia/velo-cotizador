import { ValueTransformer } from 'typeorm';

// Postgres numeric/decimal columns come back as strings via node-postgres.
// This transformer keeps them as numbers in the application layer.
export class NumericTransformer implements ValueTransformer {
  to(value: number | null | undefined): number | null | undefined {
    return value;
  }

  from(value: string | null): number | null {
    if (value === null || value === undefined) return null;
    const parsed = parseFloat(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
}
