import { Pool } from 'pg';

export function createPool(): Pool {
  return new Pool({
    connectionString:
      process.env.DATABASE_URL ??
      'postgresql://geosynch:geosynch@localhost:5432/geosynch_core',
  });
}

export async function assertDbReachable(pool: Pool): Promise<void> {
  await pool.query('SELECT 1');
}
