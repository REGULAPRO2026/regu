import { EventRepository } from '../ports/EventRepository';
import { CanonicalEvent, StoredCanonicalEvent } from '../types';

/**
 * Encapsula la regla de negocio de Event Sourcing (Ley 5): todo
 * evento se encadena con un hash sobre el anterior. El cálculo del
 * hash es lógica de dominio pura (no depende de ningún I/O); el
 * `append` delega en el puerto EventRepository.
 */
export class EventChainService {
  constructor(private readonly eventRepository: EventRepository) {}

  async append(
    event: Omit<CanonicalEvent, 'event_id' | 'timestamp'>,
    previousHash: string | null
  ): Promise<CanonicalEvent> {
    const event_id = `EV-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const timestamp = new Date().toISOString();
    const event_hash = this.computeHash(event_id, event.type, event.source_node, previousHash);

    const stored: StoredCanonicalEvent = {
      ...event,
      event_id,
      timestamp,
      previous_hash: previousHash,
      event_hash,
    };

    await this.eventRepository.append(stored);
    return { ...event, event_id, timestamp };
  }

  /** Hash simple para esta fase (no criptográfico) — suficiente para probar el encadenamiento. */
  private computeHash(
    eventId: string,
    type: string,
    sourceNode: string,
    previousHash: string | null
  ): string {
    const raw = `${previousHash ?? 'GENESIS'}|${eventId}|${type}|${sourceNode}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash * 31 + raw.charCodeAt(i)) >>> 0;
    }
    return hash.toString(16);
  }
}
