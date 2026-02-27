/** 상담 상태 */
export enum ConsultationStatus {
  pending = 'pending',
  assigned = 'assigned',
  in_progress = 'in_progress',
  completed = 'completed',
  cancelled = 'cancelled',
}

/**
 * 문의 경로
 * 1:묻고답하기(QA게시판) 2:전화상담 3:이메일 4:방문 5:홈페이지상담신청폼 99:기타
 */
export enum InquiryChannel {
  QA_BOARD = 1,
  PHONE = 2,
  EMAIL = 3,
  VISIT = 4,
  HOMEPAGE_FORM = 5,
  OTHER = 99,
}

/**
 * 문의 분류
 * 1:P-TAX(종교인소득세) 2:교회재정 3:정관/규칙 4:비영리회계 5:결산공시 99:기타
 */
export enum InquiryCategory {
  PTAX = 1,
  CHURCH_FINANCE = 2,
  BYLAWS = 3,
  NONPROFIT_ACCOUNTING = 4,
  SETTLEMENT_DISCLOSURE = 5,
  OTHER = 99,
}

/**
 * 직분 코드
 * 1:위임목사(담임목사) 2:부목사 3:전도사(강도사) 4:사모(목회자가족)
 * 5:장로 6:권사 7:집사 8:재정담당자 99:기타
 */
export enum PositionCode {
  SENIOR_PASTOR = 1,
  ASSOCIATE_PASTOR = 2,
  EVANGELIST = 3,
  PASTOR_SPOUSE = 4,
  ELDER = 5,
  DEACONESS = 6,
  DEACON = 7,
  FINANCE_DIRECTOR = 8,
  OTHER = 99,
}

export interface IConsultation {
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
}

export class Consultation implements IConsultation {
  constructor(
    public readonly id: number,
    public readonly userId: number | null,
    public readonly name: string,
    public readonly namePublic: boolean,
    public readonly phone: string,
    public readonly phonePublic: boolean,
    public readonly email: string | null,
    public readonly churchName: string | null,
    public readonly churchPublic: boolean,
    public readonly position: string | null,
    public readonly positionCode: PositionCode | null,
    public readonly consultationType: string,
    public readonly inquiryChannel: InquiryChannel | null,
    public readonly inquiryCategory: InquiryCategory | null,
    public readonly categoryDetail: string | null,
    public readonly preferredDate: Date | null,
    public readonly preferredTime: string | null,
    public readonly title: string,
    public readonly content: string,
    public readonly status: ConsultationStatus,
    public readonly assignedTo: number | null,
    public readonly consultationDate: Date | null,
    public readonly consultationNotes: string | null,
    public readonly privacyAgree: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(params: Omit<IConsultation, 'id' | 'status' | 'assignedTo' | 'consultationDate' | 'consultationNotes' | 'createdAt' | 'updatedAt'>): Consultation {
    return new Consultation(
      0, // DB AUTO_INCREMENT
      params.userId,
      params.name,
      params.namePublic,
      params.phone,
      params.phonePublic,
      params.email,
      params.churchName,
      params.churchPublic,
      params.position,
      params.positionCode,
      params.consultationType,
      params.inquiryChannel,
      params.inquiryCategory,
      params.categoryDetail,
      params.preferredDate,
      params.preferredTime,
      params.title,
      params.content,
      ConsultationStatus.pending,
      null,
      null,
      null,
      params.privacyAgree,
      new Date(),
      new Date()
    );
  }

  withStatus(status: ConsultationStatus): Consultation {
    return new Consultation(
      this.id, this.userId, this.name, this.namePublic,
      this.phone, this.phonePublic, this.email,
      this.churchName, this.churchPublic,
      this.position, this.positionCode,
      this.consultationType, this.inquiryChannel, this.inquiryCategory, this.categoryDetail,
      this.preferredDate, this.preferredTime, this.title, this.content,
      status,
      this.assignedTo, this.consultationDate, this.consultationNotes,
      this.privacyAgree, this.createdAt, new Date()
    );
  }

  assign(assignedTo: number): Consultation {
    return new Consultation(
      this.id, this.userId, this.name, this.namePublic,
      this.phone, this.phonePublic, this.email,
      this.churchName, this.churchPublic,
      this.position, this.positionCode,
      this.consultationType, this.inquiryChannel, this.inquiryCategory, this.categoryDetail,
      this.preferredDate, this.preferredTime, this.title, this.content,
      ConsultationStatus.assigned,
      assignedTo, this.consultationDate, this.consultationNotes,
      this.privacyAgree, this.createdAt, new Date()
    );
  }

  complete(notes: string): Consultation {
    return new Consultation(
      this.id, this.userId, this.name, this.namePublic,
      this.phone, this.phonePublic, this.email,
      this.churchName, this.churchPublic,
      this.position, this.positionCode,
      this.consultationType, this.inquiryChannel, this.inquiryCategory, this.categoryDetail,
      this.preferredDate, this.preferredTime, this.title, this.content,
      ConsultationStatus.completed,
      this.assignedTo, new Date(), notes,
      this.privacyAgree, this.createdAt, new Date()
    );
  }

  cancel(): Consultation {
    return new Consultation(
      this.id, this.userId, this.name, this.namePublic,
      this.phone, this.phonePublic, this.email,
      this.churchName, this.churchPublic,
      this.position, this.positionCode,
      this.consultationType, this.inquiryChannel, this.inquiryCategory, this.categoryDetail,
      this.preferredDate, this.preferredTime, this.title, this.content,
      ConsultationStatus.cancelled,
      this.assignedTo, this.consultationDate, this.consultationNotes,
      this.privacyAgree, this.createdAt, new Date()
    );
  }
}
