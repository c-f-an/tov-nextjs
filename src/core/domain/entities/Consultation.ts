export enum ConsultationType {
  FINANCE = 'FINANCE',
  TAX = 'TAX',
  ACCOUNTING = 'ACCOUNTING',
  LEGAL = 'LEGAL',
  OTHER = 'OTHER'
}

export enum ConsultationStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface IConsultation {
  id: string;
  userId: string;
  counselorId?: string;
  type: ConsultationType;
  status: ConsultationStatus;
  title: string;
  content: string;
  attachments?: string[];
  preferredDate: Date;
  preferredTime: string;
  consultationNote?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class Consultation implements IConsultation {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly type: ConsultationType,
    public readonly status: ConsultationStatus,
    public readonly title: string,
    public readonly content: string,
    public readonly preferredDate: Date,
    public readonly preferredTime: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly counselorId?: string,
    public readonly attachments?: string[],
    public readonly consultationNote?: string,
    public readonly completedAt?: Date
  ) {}

  static create(params: Omit<IConsultation, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'counselorId' | 'consultationNote' | 'completedAt'>): Consultation {
    return new Consultation(
      crypto.randomUUID(),
      params.userId,
      params.type,
      ConsultationStatus.PENDING,
      params.title,
      params.content,
      params.preferredDate,
      params.preferredTime,
      new Date(),
      new Date(),
      undefined,
      params.attachments
    );
  }

  assignCounselor(counselorId: string): Consultation {
    return new Consultation(
      this.id,
      this.userId,
      this.type,
      ConsultationStatus.ASSIGNED,
      this.title,
      this.content,
      this.preferredDate,
      this.preferredTime,
      this.createdAt,
      new Date(),
      counselorId,
      this.attachments,
      this.consultationNote,
      this.completedAt
    );
  }

  complete(note: string): Consultation {
    return new Consultation(
      this.id,
      this.userId,
      this.type,
      ConsultationStatus.COMPLETED,
      this.title,
      this.content,
      this.preferredDate,
      this.preferredTime,
      this.createdAt,
      new Date(),
      this.counselorId,
      this.attachments,
      note,
      new Date()
    );
  }

  cancel(): Consultation {
    return new Consultation(
      this.id,
      this.userId,
      this.type,
      ConsultationStatus.CANCELLED,
      this.title,
      this.content,
      this.preferredDate,
      this.preferredTime,
      this.createdAt,
      new Date(),
      this.counselorId,
      this.attachments,
      this.consultationNote,
      this.completedAt
    );
  }
}