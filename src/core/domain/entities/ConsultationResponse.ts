/**
 * 답변 유형
 * 1:답변 2:전문가/기관연결 3:추가확인후재답변 4:추가질문
 */
export enum ResponseType {
  ANSWER = 1,
  REFERRAL = 2,
  FOLLOWUP = 3,
  QUESTION = 4,
}

export interface IConsultationResponse {
  id: number;
  consultationId: number;
  responderId: number | null;
  responderName: string | null;
  responseType: ResponseType;
  content: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class ConsultationResponse implements IConsultationResponse {
  constructor(
    public readonly id: number,
    public readonly consultationId: number,
    public readonly responderId: number | null,
    public readonly responderName: string | null,
    public readonly responseType: ResponseType,
    public readonly content: string,
    public readonly isPublic: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(params: Omit<IConsultationResponse, 'id' | 'createdAt' | 'updatedAt'>): ConsultationResponse {
    return new ConsultationResponse(
      0,
      params.consultationId,
      params.responderId,
      params.responderName,
      params.responseType,
      params.content,
      params.isPublic,
      new Date(),
      new Date()
    );
  }
}
