import { createServer } from 'http';
import { readFileSync } from 'fs';
import { join } from 'path';
import { MotorMapa } from '../../motores/src/plugins/motor-mapa';

export function startMapServer(motorMapa: MotorMapa) {
  const server = createServer((req, res) => {

    // API del Motor Mapa
    if (req.url === '/api/map' && req.method === 'GET') {
      const projection = motorMapa.getProjectionSnapshot();

      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      });

      res.end(JSON.stringify(projection));
      return;
    }

    // Interfaz visual del Motor Mapa
    if (req.url === '/' && req.method === 'GET') {
      try {
        const html = readFileSync(
          join(process.cwd(), 'mapa.html'),
          'utf-8'
        );

        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
        });

        res.end(html);
        return;

      } catch (error) {
        console.error('[HTTP] No se pudo cargar mapa.html:', error);

        res.writeHead(500, {
          'Content-Type': 'text/plain; charset=utf-8',
        });

        res.end('No se pudo cargar mapa.html');
        return;
      }
    }

    // Ruta desconocida
    res.writeHead(404, {
      'Content-Type': 'application/json; charset=utf-8',
    });

    res.end(JSON.stringify({ error: 'Not found' }));
  });

  server.listen(3000, () => {
    console.log(
      '[HTTP] Motor Mapa disponible en http://localhost:3000/'
    );
  });

  return server;
}