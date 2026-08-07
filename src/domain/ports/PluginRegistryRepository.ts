import { MotorManifest, PluginStatus } from '../types';

export interface PluginRegistryRepository {
  upsertRegistration(manifest: MotorManifest): Promise<void>;
  setStatus(motorId: string, status: PluginStatus): Promise<void>;
  markUnregistered(motorId: string): Promise<void>;
}
