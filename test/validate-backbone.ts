/**
 * Corre la checklist de validación de la columna vertebral.
 * Uso: npm run validate (requiere Docker Compose corriendo)
 */

import { bootstrap } from '../src/server';
import * as fs from 'fs';
import * as path from 'path';

let passed = 0;
let failed = 0;

function check(label: string, ok: boolean, detail?: string) {
  if (ok) {
    passed++;
    console.log(`✅ ${label}`);
  } else {
    failed++;
    console.log(`❌ ${label}${detail ? ' — ' + detail : ''}`);
  }
}

/**
 * Recorre recursivamente un directorio buscando imports de 'pg'.
 */
function findPgImports(dir: string): string[] {
  const offenders: string[] = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      offenders.push(...findPgImports(fullPath));

    } else if (entry.name.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf-8');

      if (
        content.includes("from 'pg'") ||
        content.includes('require("pg")') ||
        content.includes("require('pg')")
      ) {
        offenders.push(fullPath);
      }
    }
  }

  return offenders;
}


async function main() {

  const { toyMotor, runtime, pool } = await bootstrap();


  // ============================================================
  // Directiva "Cero Datos Huérfanos"
  // ============================================================

  const orphanResult = await toyMotor.attemptOrphanNode();

  check(
    'Cero Datos Huérfanos: Core rechaza nodo sin owner/provenance',
    orphanResult.blocked,
    orphanResult.reason
  );


  // ============================================================
  // Ley 5: Inmutabilidad
  // ============================================================

  // Nodo único para cada ejecución del test
  const testNodeId = `NODE-COUNTER-${Date.now()}`;

  await toyMotor.createCounter(
    testNodeId,
    'USER-TEST'
  );


  const eventsBefore = await pool.query(
    'SELECT count(*) FROM events'
  );


  await toyMotor.incrementCounter(testNodeId);


  // Tiempo para que ProjectionEngine procese evento
  await new Promise((r) => setTimeout(r, 300));


  const eventsAfter = await pool.query(
    'SELECT count(*) FROM events'
  );


  const nodeRow = await pool.query(
    'SELECT version, current_projection FROM nodes WHERE node_id = $1',
    [testNodeId]
  );


  check(
    'Ley 5 (Inmutabilidad): incrementar generó evento y la proyección derivó estado',
    Number(eventsAfter.rows[0].count) >
      Number(eventsBefore.rows[0].count) &&
      nodeRow.rows[0]?.current_projection?.value === 1
  );


  // ============================================================
  // Ley 4: Permisos por propósito
  // ============================================================

  const permResult =
    await toyMotor.attemptUnauthorizedRead(testNodeId);


  check(
    'Ley 4 (Permisos): Core rechaza lectura sin permiso otorgado',
    permResult.blocked,
    permResult.reason
  );


  // ============================================================
  // Ley 9: Neutralidad tecnológica
  // ============================================================

  const domainOffenders =
    findPgImports(
      path.join(__dirname, '../src/domain')
    );

  const applicationOffenders =
    findPgImports(
      path.join(__dirname, '../src/application')
    );


  check(
    "Ley 9 (Neutralidad) / frontera infraestructura: domain y application no importan pg",
    domainOffenders.length === 0 &&
    applicationOffenders.length === 0,
    [...domainOffenders, ...applicationOffenders].join(', ')
  );


  // ============================================================
  // Aislamiento de fallos
  // ============================================================

  await toyMotor.simulateCrashOnNextEvent();

  await toyMotor.incrementCounter(testNodeId);


  await new Promise((r) => setTimeout(r, 500));


  const healthAfterCrash =
    await runtime.checkMotorHealth('motor_contador');


  check(
    'Aislamiento de fallos: Runtime sigue operativo tras crash del motor',
    runtime.listActiveMotors()
      .includes('motor_contador'),
    healthAfterCrash.detail
  );


  console.log(
    `\n${passed} pasadas, ${failed} fallidas.`
  );


  process.exit(failed > 0 ? 1 : 0);
}


main().catch((err) => {

  console.error(
    'Error ejecutando validación:',
    err
  );

  process.exit(1);
});