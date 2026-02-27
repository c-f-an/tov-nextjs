import { ConsultationResponse } from '../entities/ConsultationResponse';

export interface IConsultationResponseRepository {
  findByConsultationId(consultationId: number): Promise<ConsultationResponse[]>;
  findById(id: number): Promise<ConsultationResponse | null>;
  save(response: ConsultationResponse): Promise<number>;
  update(response: ConsultationResponse): Promise<void>;
  delete(id: number): Promise<void>;
}
