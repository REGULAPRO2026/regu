import { NodeRepository } from '../ports/NodeRepository';
import { NodeInput, StoredNode } from '../types';

export class OrphanNodeError extends Error {}
export class DuplicateNodeError extends Error {}

/**
 * Servicio de dominio. Reducido deliberadamente: solo conoce las
 * INVARIANTES de un Nodo (Cero Datos Huérfanos, inmutabilidad vía
 * no-reregistro). Ya NO conoce proyecciones — eso vive en
 * application/ProjectionEngine.ts, porque "cómo se deriva el estado
 * visible a partir de eventos" es una decisión operativa/de negocio
 * por tipo de evento, no una invariante de identidad del nodo.
 */
export class NodeIdentityService {
  constructor(private readonly nodeRepository: NodeRepository) {}

  async register(input: NodeInput): Promise<StoredNode> {
    this.validateNoOrphan(input);

    if (await this.nodeRepository.existsById(input.node_id)) {
      throw new DuplicateNodeError(
        `El nodo ${input.node_id} ya existe. Los cambios de estado deben emitirse como eventos, no re-registrarse (Ley 5).`
      );
    }

    const now = new Date().toISOString();
    const stored: StoredNode = {
      ...input,
      current_projection: input.current_projection ?? {},
      version: 1,
      created_at: now,
      updated_at: now,
    };

    await this.nodeRepository.insert(stored);
    return stored;
  }

  async get(nodeId: string): Promise<StoredNode | null> {
    return this.nodeRepository.findById(nodeId);
  }

  private validateNoOrphan(input: NodeInput): void {
    const missing: string[] = [];
    if (!input.node_id) missing.push('node_id');
    if (!input.node_type) missing.push('node_type');
    if (!input.owner) missing.push('owner');
    if (!input.provenance?.source) missing.push('provenance.source');

    if (missing.length > 0) {
      throw new OrphanNodeError(
        `Nodo rechazado por Directiva "Cero Datos Huérfanos". Faltan: ${missing.join(', ')}`
      );
    }
  }
}
