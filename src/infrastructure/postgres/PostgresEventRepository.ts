import { Pool } from 'pg';
import { EventRepository } from '../../domain/ports/EventRepository';
import { StoredCanonicalEvent } from '../../domain/types';

export class PostgresEventRepository implements EventRepository {
  constructor(private readonly pool: Pool) {}

  async append(event: StoredCanonicalEvent): Promise<void> {
    await this.pool.query(
      `INSERT INTO events (event_id, event_type, source_node, payload, provenance, previous_hash, event_hash, emitted_by_motor)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        event.event_id,
        event.type,
        event.source_node,
        JSON.stringify(event.payload),
        JSON.stringify(event.provenance),
        event.previous_hash,
        event.event_hash,
        event.emitted_by_motor,
      ]
    );
  }

  async findBySourceNode(nodeId: string): Promise<StoredCanonicalEvent[]> {
    const result = await this.pool.query(
      `SELECT event_id, event_type, source_node, payload, provenance, previous_hash, event_hash, emitted_by_motor, created_at
       FROM events WHERE source_node = $1 ORDER BY created_at ASC`,
      [nodeId]
    );
    return result.rows.map((row) => ({
      event_id: row.event_id,
      type: row.event_type,
      source_node: row.source_node,
      timestamp: row.created_at,
      payload: row.payload,
      provenance: row.provenance,
      emitted_by_motor: row.emitted_by_motor,
      previous_hash: row.previous_hash,
      event_hash: row.event_hash,
    }));
  }
}
