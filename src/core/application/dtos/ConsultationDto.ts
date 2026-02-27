import { Consultation, ConsultationStatus, InquiryChannel, InquiryCategory, PositionCode } from '@/core/domain/entities/Consultation';

export class ConsultationDto {
  id: number;
  userId: number | null;
  name: string;
  namePublic: boolean;
  phone: string;
  phonePublic: boolean;
  email: string | null;
  churchName: string | null;
  churchPublic: boolean;
  position: string | null;
  positionCode: PositionCode | null;
  consultationType: string;
  inquiryChannel: InquiryChannel | null;
  inquiryCategory: InquiryCategory | null;
  categoryDetail: string | null;
  preferredDate: Date | null;
  preferredTime: string | null;
  title: string;
  content: string;
  status: ConsultationStatus;
  assignedTo: number | null;
  consultationDate: Date | null;
  consultationNotes: string | null;
  privacyAgree: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: ConsultationDto) {
    this.id = data.id;
    this.userId = data.userId;
    this.name = data.name;
    this.namePublic = data.namePublic;
    this.phone = data.phone;
    this.phonePublic = data.phonePublic;
    this.email = data.email;
    this.churchName = data.churchName;
    this.churchPublic = data.churchPublic;
    this.position = data.position;
    this.positionCode = data.positionCode;
    this.consultationType = data.consultationType;
    this.inquiryChannel = data.inquiryChannel;
    this.inquiryCategory = data.inquiryCategory;
    this.categoryDetail = data.categoryDetail;
    this.preferredDate = data.preferredDate;
    this.preferredTime = data.preferredTime;
    this.title = data.title;
    this.content = data.content;
    this.status = data.status;
    this.assignedTo = data.assignedTo;
    this.consultationDate = data.consultationDate;
    this.consultationNotes = data.consultationNotes;
    this.privacyAgree = data.privacyAgree;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static fromEntity(consultation: Consultation): ConsultationDto {
    return new ConsultationDto({
      id: consultation.id,
      userId: consultation.userId,
      name: consultation.name,
      namePublic: consultation.namePublic,
      phone: consultation.phone,
      phonePublic: consultation.phonePublic,
      email: consultation.email,
      churchName: consultation.churchName,
      churchPublic: consultation.churchPublic,
      position: consultation.position,
      positionCode: consultation.positionCode,
      consultationType: consultation.consultationType,
      inquiryChannel: consultation.inquiryChannel,
      inquiryCategory: consultation.inquiryCategory,
      categoryDetail: consultation.categoryDetail,
      preferredDate: consultation.preferredDate,
      preferredTime: consultation.preferredTime,
      title: consultation.title,
      content: consultation.content,
      status: consultation.status,
      assignedTo: consultation.assignedTo,
      consultationDate: consultation.consultationDate,
      consultationNotes: consultation.consultationNotes,
      privacyAgree: consultation.privacyAgree,
      createdAt: consultation.createdAt,
      updatedAt: consultation.updatedAt,
    });
  }
}
