import { Consultation, ConsultationStatus } from '@/core/domain/entities/Consultation';
import { UserDto } from './UserDto';

export class ConsultationDto {
  id: number;
  userId: number | null;
  name: string;
  phone: string;
  email: string | null;
  churchName: string | null;
  position: string | null;
  consultationType: string;
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
  user?: UserDto;

  constructor(data: ConsultationDto) {
    this.id = data.id;
    this.userId = data.userId;
    this.name = data.name;
    this.phone = data.phone;
    this.email = data.email;
    this.churchName = data.churchName;
    this.position = data.position;
    this.consultationType = data.consultationType;
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
    this.user = data.user;
  }

  static fromEntity(consultation: Consultation, includeRelations?: { user?: UserDto }): ConsultationDto {
    return new ConsultationDto({
      id: consultation.id,
      userId: consultation.userId,
      name: consultation.name,
      phone: consultation.phone,
      email: consultation.email,
      churchName: consultation.churchName,
      position: consultation.position,
      consultationType: consultation.consultationType,
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
      user: includeRelations?.user
    });
  }
}