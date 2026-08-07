import { StoredCanonicalEvent } from '../types';

/**
 * Puerto. El dominio solo sabe que los eventos se "appendean" — no
 * sabe si es Postgres, un archivo, o Kafka por debajo. La Ley 5
 * (Inmutabilidad) se expresa aquí en la firma: no existe update()
 * ni delete() en este contrato, deliberadamente.
 */
export interface EventRepository {
  append(event: StoredCanonicalEvent): Promise<void>;
  findBySourceNode(nodeId: string): Promise<StoredCanonicalEvent[]>;
}
