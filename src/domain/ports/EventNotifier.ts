import { CanonicalEvent } from '../types';

/**
 * Puerto de entrega de eventos. Hoy lo implementa Postgres LISTEN/NOTIFY;
 * el día que se migre a NATS o Kafka, esta interfaz no cambia — solo
 * cambia el adaptador en infrastructure/. Ni el dominio ni la capa de
 * aplicación (ProjectionEngine, PluginRegistry) se enteran del cambio.
 */
export interface EventNotifier {
  subscribe(subscriberId: string, handler: (event: CanonicalEvent) => Promise<void>): void;
  unsubscribe(subscriberId: string): void;
}
