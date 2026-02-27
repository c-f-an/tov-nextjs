/**
 * 후속 모임 방식
 * 1:전화 2:온라인(Zoom등) 3:방문 99:기타
 */
export enum MeetingType {
  PHONE = 1,
  ONLINE = 2,
  VISIT = 3,
  OTHER = 99,
}

/**
 * 후속 모임 상태
 * 1:예정 2:완료 3:취소
 */
export enum FollowupStatus {
  SCHEDULED = 1,
  COMPLETED = 2,
  CANCELLED = 3,
}

export interface IConsultationFollowup {
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
}

export class ConsultationFollowup implements IConsultationFollowup {
  constructor(
    public readonly id: number,
    public readonly originalConsultationId: number,
    public readonly followupConsultationId: number | null,
    public readonly followupOrder: number,
    public readonly meetingType: MeetingType | null,
    public readonly scheduledAt: Date | null,
    public readonly metAt: Date | null,
    public readonly topic: string | null,
    public readonly notes: string | null,
    public readonly assignedTo: number | null,
    public readonly status: FollowupStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(params: Omit<IConsultationFollowup, 'id' | 'status' | 'createdAt' | 'updatedAt'>): ConsultationFollowup {
    return new ConsultationFollowup(
      0,
      params.originalConsultationId,
      params.followupConsultationId,
      params.followupOrder,
      params.meetingType,
      params.scheduledAt,
      params.metAt,
      params.topic,
      params.notes,
      params.assignedTo,
      FollowupStatus.SCHEDULED,
      new Date(),
      new Date()
    );
  }

  complete(metAt: Date, notes: string): ConsultationFollowup {
    return new ConsultationFollowup(
      this.id, this.originalConsultationId, this.followupConsultationId,
      this.followupOrder, this.meetingType, this.scheduledAt,
      metAt, this.topic, notes,
      this.assignedTo, FollowupStatus.COMPLETED,
      this.createdAt, new Date()
    );
  }

  cancel(): ConsultationFollowup {
    return new ConsultationFollowup(
      this.id, this.originalConsultationId, this.followupConsultationId,
      this.followupOrder, this.meetingType, this.scheduledAt,
      this.metAt, this.topic, this.notes,
      this.assignedTo, FollowupStatus.CANCELLED,
      this.createdAt, new Date()
    );
  }
}
