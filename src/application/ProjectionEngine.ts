import { EventNotifier } from '../domain/ports/EventNotifier';
import { NodeRepository } from '../domain/ports/NodeRepository';
import { CanonicalEvent } from '../domain/types';

/**
 * RUNTIME — ProjectionEngine.
 *
 * Antes vivía como un método (`applyProjectionFromEvent`) dentro del
 * servicio de dominio de nodos. Se saca de ahí a propósito: decidir
 * "qué campo de la proyección actualiza cada tipo de evento" es una
 * regla operativa que crece con cada Motor nuevo (Propiedades define
 * su propia proyección, Turismo la suya, etc.) — no es una invariante
 * de identidad del Nodo. Mezclarlo en el dominio lo haría crecer sin
 * límite cada vez que se agregue un Motor.
 *
 * Este engine es genérico: cada regla de proyección se registra por
 * tipo de evento. El motor de juguete registra la suya en su propio
 * archivo (ver plugins/toy-motor), no aquí.
 */
export type ProjectionRule = (
  currentProjection: Record<string, unknown>,
  event: CanonicalEvent
) => Record<string, unknown>;

export class ProjectionEngine {
  private rules = new Map<string, ProjectionRule>();

  constructor(
    private readonly nodeRepository: NodeRepository,
    private readonly eventNotifier: EventNotifier
  ) {}

  /** Un Motor (o el bootstrap) registra cómo un tipo de evento transforma la proyección. */
  registerRule(eventType: string, rule: ProjectionRule): void {
    this.rules.set(eventType, rule);
  }

  start(): void {
    this.eventNotifier.subscribe('projection-engine', async (event) => {
      const rule = this.rules.get(event.type);
      if (!rule) return; // evento sin regla de proyección asociada — no es un error, simplemente no proyecta

      const node = await this.nodeRepository.findById(event.source_node);
      if (!node) return;

      const newProjection = rule(node.current_projection ?? {}, event);
      await this.nodeRepository.updateProjection(event.source_node, {
        ...newProjection,
        _derived_from_event: event.event_id,
      }, node.version + 1);
    });
  }

  stop(): void {
    this.eventNotifier.unsubscribe('projection-engine');
  }
}
