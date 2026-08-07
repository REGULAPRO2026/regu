import { Pool } from 'pg';
import { PermissionRepository } from '../../domain/ports/PermissionRepository';
import { PermissionDecision, PermissionGrant, PermissionRequest } from '../../domain/types';

export class PostgresPermissionRepository implements PermissionRepository {
  constructor(private readonly pool: Pool) {}

  async findActiveGrant(req: PermissionRequest): Promise<PermissionGrant | null> {
    const result = await this.pool.query(
      `SELECT permission_id FROM permissions
       WHERE actor = $1
         AND purpose = $2
         AND (data_scope = $3 OR data_scope = 'NODE_TYPE:*')
         AND valid_from <= now()
         AND (valid_until IS NULL OR valid_until >= now())`,
      [req.actor, req.purpose, req.data_scope]
    );
    if (result.rowCount === 0) return null;
    return { permission_id: result.rows[0].permission_id };
  }

  async logDecision(req: PermissionRequest, decision: PermissionDecision): Promise<void> {
    await this.pool.query(
      `INSERT INTO permission_audit_log (log_id, actor, purpose, data_scope, granted, reason)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        `LOG-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        req.actor,
        req.purpose,
        req.data_scope,
        decision.granted,
        decision.reason,
      ]
    );
  }
}
