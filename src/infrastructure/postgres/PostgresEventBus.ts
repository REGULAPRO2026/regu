import { Client } from 'pg';
import { EventNotifier } from '../../domain/ports/EventNotifier';
import { CanonicalEvent } from '../../domain/types';

type Subscriber = { id: string; handler: (event: CanonicalEvent) => Promise<void> };

/**
 * Adaptador de EventNotifier sobre Postgres LISTEN/NOTIFY. El INSERT
 * en `events` (hecho por PostgresEventRepository) dispara un trigger
 * SQL que hace pg_notify — este cliente escucha esa notificación y
 * rutea a los suscriptores. Migrar a NATS/Kafka el día de mañana
 * significa escribir OTRO adaptador de EventNotifier, sin tocar
 * dominio ni aplicación.
 */
export class PostgresEventBus implements EventNotifier {
  private listenClient: Client | null = null;
  private subscribers: Subscriber[] = [];

  async start(connectionString?: string): Promise<void> {
    this.listenClient = new Client({
      connectionString:
        connectionString ??
        process.env.DATABASE_URL ??
        'postgresql://geosynch:geosynch@localhost:5432/geosynch_core',
    });
    await this.listenClient.connect();
    await this.listenClient.query('LISTEN geosynch_events');

    this.listenClient.on('notification', async (msg) => {
      if (!msg.payload) return;
      const row = JSON.parse(msg.payload);
      const event: CanonicalEvent = {
        event_id: row.event_id,
        type: row.event_type,
        source_node: row.source_node,
        timestamp: row.created_at,
        payload: row.payload,
        provenance: row.provenance,
        emitted_by_motor: row.emitted_by_motor,
      };
      await this.routeToSubscribers(event);
    });
  }

  subscribe(subscriberId: string, handler: (event: CanonicalEvent) => Promise<void>): void {
    this.subscribers.push({ id: subscriberId, handler });
  }

  unsubscribe(subscriberId: string): void {
    this.subscribers = this.subscribers.filter((s) => s.id !== subscriberId);
  }

  /** Aislamiento de fallos: un suscriptor que lanza excepción no afecta a los demás ni al bus. */
  private async routeToSubscribers(event: CanonicalEvent): Promise<void> {
    for (const sub of this.subscribers) {
      try {
        await sub.handler(event);
      } catch (err) {
        console.error(
          `[EventBus] Suscriptor "${sub.id}" falló procesando evento ${event.event_id}. ` +
          `Aislado — el bus y los demás suscriptores continúan. Detalle:`,
          err instanceof Error ? err.message : err
        );
      }
    }
  }

  async stop(): Promise<void> {
    await this.listenClient?.end();
  }
}
