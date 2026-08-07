import { PermissionRepository } from '../ports/PermissionRepository';
import { PermissionDecision, PermissionRequest } from '../types';

/**
 * Ley 4: Consentimiento por Propósito. Único punto de decisión de
 * acceso en todo el sistema. Nada en Runtime o Motores debe
 * saltarse esta evaluación — ni siquiera Regulito (Directiva 4).
 */
export class PermissionEngine {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async evaluate(req: PermissionRequest): Promise<PermissionDecision> {
    const grant = await this.permissionRepository.findActiveGrant(req);

    const decision: PermissionDecision = grant
      ? { granted: true, reason: `Autorizado por permiso ${grant.permission_id}` }
      : {
          granted: false,
          reason: `Sin permiso vigente para actor=${req.actor}, purpose=${req.purpose}, scope=${req.data_scope}`,
        };

    // Ley 4 exige rastro de TODA decisión — si esto falla, la excepción se propaga.
    await this.permissionRepository.logDecision(req, decision);
    return decision;
  }
}
