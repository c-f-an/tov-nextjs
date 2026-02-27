import { ConsultationFollowup } from '../entities/ConsultationFollowup';

export interface IConsultationFollowupRepository {
  findByOriginalConsultationId(originalConsultationId: number): Promise<ConsultationFollowup[]>;
  findById(id: number): Promise<ConsultationFollowup | null>;
  save(followup: ConsultationFollowup): Promise<number>;
  update(followup: ConsultationFollowup): Promise<void>;
  delete(id: number): Promise<void>;
  getNextFollowupOrder(originalConsultationId: number): Promise<number>;
}
