import { Consultation, ConsultationStatus, ConsultationType } from '../entities/Consultation';
import { PaginatedResult, PaginationParams } from './IPostRepository';

interface ConsultationFilters {
  userId?: string;
  counselorId?: string;
  type?: ConsultationType;
  status?: ConsultationStatus;
  dateFrom?: Date;
  dateTo?: Date;
}

interface IConsultationRepository {
  findById(id: string): Promise<Consultation | null>;
  findByUserId(userId: string, pagination: PaginationParams): Promise<PaginatedResult<Consultation>>;
  findByCounselorId(counselorId: string, pagination: PaginationParams): Promise<PaginatedResult<Consultation>>;
  findAll(filters: ConsultationFilters, pagination: PaginationParams): Promise<PaginatedResult<Consultation>>;
  save(consultation: Consultation): Promise<void>;
  update(consultation: Consultation): Promise<void>;
  delete(id: string): Promise<void>;
  countByStatus(status: ConsultationStatus): Promise<number>;
}

export type { IConsultationRepository, ConsultationFilters };