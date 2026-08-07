import { Pool } from 'pg';
import { PluginRegistryRepository } from '../../domain/ports/PluginRegistryRepository';
import { MotorManifest, PluginStatus } from '../../domain/types';

export class PostgresPluginRegistryRepository implements PluginRegistryRepository {
  constructor(private readonly pool: Pool) {}

  async upsertRegistration(manifest: MotorManifest): Promise<void> {
    await this.pool.query(
      `INSERT INTO plugin_registry (motor_id, version, manifest, status)
       VALUES ($1, $2, $3, 'REGISTERED')
       ON CONFLICT (motor_id) DO UPDATE
         SET version = EXCLUDED.version, manifest = EXCLUDED.manifest, status = 'REGISTERED', unregistered_at = NULL`,
      [manifest.motor_id, manifest.version, JSON.stringify(manifest)]
    );
  }

  async setStatus(motorId: string, status: PluginStatus): Promise<void> {
    await this.pool.query(
      `UPDATE plugin_registry SET status = $2, last_health_check = now() WHERE motor_id = $1`,
      [motorId, status]
    );
  }

  async markUnregistered(motorId: string): Promise<void> {
    await this.pool.query(
      `UPDATE plugin_registry SET status = 'UNREGISTERED', unregistered_at = now() WHERE motor_id = $1`,
      [motorId]
    );
  }
}
