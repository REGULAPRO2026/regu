import { Pool } from 'pg';
import { NodeRepository } from '../../domain/ports/NodeRepository';
import { StoredNode } from '../../domain/types';

/**
 * Adaptador. Implementa el puerto NodeRepository usando Postgres+PostGIS.
 * Es la ÚNICA pieza del sistema que sabe qué es ST_MakePoint o SRID 4326.
 * Si mañana se cambia a otro motor geoespacial, solo este archivo cambia.
 */
export class PostgresNodeRepository implements NodeRepository {
  constructor(private readonly pool: Pool) {}

  async existsById(nodeId: string): Promise<boolean> {
    const result = await this.pool.query('SELECT 1 FROM nodes WHERE node_id = $1', [nodeId]);
    return (result.rowCount ?? 0) > 0;
  }

  async insert(node: StoredNode): Promise<void> {
    const locationSql = node.location
      ? `ST_SetSRID(ST_MakePoint(${node.location.lng}, ${node.location.lat}), 4326)`
      : 'NULL';

    await this.pool.query(
      `INSERT INTO nodes (node_id, node_type, owner, provenance_source, provenance_confidence, current_projection, location)
       VALUES ($1, $2, $3, $4, $5, $6, ${locationSql})`,
      [
        node.node_id,
        node.node_type,
        node.owner,
        node.provenance.source,
        node.provenance.confidence,
        JSON.stringify(node.current_projection ?? {}),
      ]
    );
  }

  async findById(nodeId: string): Promise<StoredNode | null> {
    const result = await this.pool.query(
      `SELECT node_id, node_type, version, owner, provenance_source, provenance_confidence, current_projection, created_at, updated_at
       FROM nodes WHERE node_id = $1`,
      [nodeId]
    );
    if (result.rowCount === 0) return null;
    return this.rowToStoredNode(result.rows[0]);
  }

  async updateProjection(
    nodeId: string,
    newProjection: Record<string, unknown>,
    newVersion: number
  ): Promise<void> {
    await this.pool.query(
      `UPDATE nodes SET current_projection = $2, version = $3, updated_at = now() WHERE node_id = $1`,
      [nodeId, JSON.stringify(newProjection), newVersion]
    );
  }

  private rowToStoredNode(row: any): StoredNode {
    return {
      node_id: row.node_id,
      node_type: row.node_type,
      version: row.version,
      owner: row.owner,
      provenance: {
        source: row.provenance_source,
        confidence: Number(row.provenance_confidence),
      },
      current_projection: row.current_projection,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }
}
