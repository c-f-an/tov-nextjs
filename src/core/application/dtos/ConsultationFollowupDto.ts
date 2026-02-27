import { ConsultationFollowup, FollowupStatus, MeetingType } from '@/core/domain/entities/ConsultationFollowup';

export class ConsultationFollowupDto {
  id: number;
  originalConsultationId: number;
  followupConsultationId: number | null;
  followupOrder: number;
  meetingType: MeetingType | null;
  scheduledAt: Date | null;
  metAt: Date | null;
  topic: string | null;
  notes: string | null;
  assignedTo: number | null;
  status: FollowupStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: ConsultationFollowupDto) {
    this.id = data.id;
    this.originalConsultationId = data.originalConsultationId;
    this.followupConsultationId = data.followupConsultationId;
    this.followupOrder = data.followupOrder;
    this.meetingType = data.meetingType;
    this.scheduledAt = data.scheduledAt;
    this.metAt = data.metAt;
    this.topic = data.topic;
    this.notes = data.notes;
    this.assignedTo = data.assignedTo;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static fromEntity(followup: ConsultationFollowup): ConsultationFollowupDto {
    return new ConsultationFollowupDto({
      id: followup.id,
      originalConsultationId: followup.originalConsultationId,
      followupConsultationId: followup.followupConsultationId,
      followupOrder: followup.followupOrder,
      meetingType: followup.meetingType,
      scheduledAt: followup.scheduledAt,
      metAt: followup.metAt,
      topic: followup.topic,
      notes: followup.notes,
      assignedTo: followup.assignedTo,
      status: followup.status,
      createdAt: followup.createdAt,
      updatedAt: followup.updatedAt,
    });
  }
}
