import { StoredNode } from '../types';

/**
 * Puerto. El dominio depende de esta interfaz, nunca de una
 * implementación concreta. La infraestructura (Postgres, o cualquier
 * otra cosa en el futuro) implementa esto sin que el dominio lo sepa.
 */
export interface NodeRepository {
  existsById(nodeId: string): Promise<boolean>;
  insert(node: StoredNode): Promise<void>;
  findById(nodeId: string): Promise<StoredNode | null>;
  /** Actualiza SOLO la proyección derivada — nunca el historial (Ley 5). */
  updateProjection(
    nodeId: string,
    newProjection: Record<string, unknown>,
    newVersion: number
  ): Promise<void>;
}
