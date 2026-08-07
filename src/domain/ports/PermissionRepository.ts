import { PermissionDecision, PermissionGrant, PermissionRequest } from '../types';

export interface PermissionRepository {
  findActiveGrant(req: PermissionRequest): Promise<PermissionGrant | null>;
  /** Debe fallar de forma ruidosa si no puede auditar — Ley 4 no permite silencio. */
  logDecision(req: PermissionRequest, decision: PermissionDecision): Promise<void>;
}
