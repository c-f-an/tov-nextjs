import { Consultation, InquiryChannel, InquiryCategory, PositionCode } from '@/core/domain/entities/Consultation';
import type { IConsultationRepository } from '@/core/domain/repositories/IConsultationRepository';
import { ConsultationDto } from '../../dtos/ConsultationDto';

export interface CreateConsultationRequest {
  userId?: number;
  name: string;
  namePublic?: boolean;
  phone: string;
  phonePublic?: boolean;
  email?: string;
  churchName?: string;
  churchPublic?: boolean;
  position?: string;
  positionCode?: PositionCode;
  consultationType: string;
  inquiryChannel?: InquiryChannel;
  inquiryCategory?: InquiryCategory;
  categoryDetail?: string;
  preferredDate?: Date;
  preferredTime?: string;
  title: string;
  content: string;
  privacyAgree: boolean;
}

export class CreateConsultationUseCase {
  constructor(private consultationRepository: IConsultationRepository) {}

  async execute(request: CreateConsultationRequest): Promise<ConsultationDto> {
    if (!request.privacyAgree) {
      throw new Error('Privacy agreement is required');
    }

    const consultation = Consultation.create({
      userId: request.userId ?? null,
      name: request.name,
      namePublic: request.namePublic ?? true,
      phone: request.phone,
      phonePublic: request.phonePublic ?? true,
      email: request.email ?? null,
      churchName: request.churchName ?? null,
      churchPublic: request.churchPublic ?? true,
      position: request.position ?? null,
      positionCode: request.positionCode ?? null,
      consultationType: request.consultationType,
      inquiryChannel: request.inquiryChannel ?? null,
      inquiryCategory: request.inquiryCategory ?? null,
      categoryDetail: request.categoryDetail ?? null,
      preferredDate: request.preferredDate ?? null,
      preferredTime: request.preferredTime ?? null,
      title: request.title,
      content: request.content,
      privacyAgree: request.privacyAgree,
    });

    const insertedId = await this.consultationRepository.save(consultation);
    const saved = await this.consultationRepository.findById(insertedId);
    if (!saved) throw new Error('Failed to retrieve saved consultation');
    return ConsultationDto.fromEntity(saved);
  }
}