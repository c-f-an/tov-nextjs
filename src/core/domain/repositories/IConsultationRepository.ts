import { Consultation, ConsultationStatus, InquiryCategory, InquiryChannel } from '../entities/Consultation';
import { PaginatedResult, PaginationParams } from './IPostRepository';

export interface ConsultationFilters {
  userId?: number;
  assignedTo?: number;
  status?: ConsultationStatus;
  inquiryChannel?: InquiryChannel;
  inquiryCategory?: InquiryCategory;
  dateFrom?: Date;
  dateTo?: Date;
  keyword?: string;
}

export interface IConsultationRepository {
  findById(id: number): Promise<Consultation | null>;
  findByUserId(userId: number, pagination: PaginationParams): Promise<PaginatedResult<Consultation>>;
  findAll(filters: ConsultationFilters, pagination: PaginationParams): Promise<PaginatedResult<Consultation>>;
  save(consultation: Consultation): Promise<number>;
  update(consultation: Consultation): Promise<void>;
  delete(id: number): Promise<void>;
  countByStatus(status: ConsultationStatus): Promise<number>;
}
