import { ConsultationResponse, ResponseType } from '@/core/domain/entities/ConsultationResponse';

export class ConsultationResponseDto {
  id: number;
  consultationId: number;
  responderId: number | null;
  responderName: string | null;
  responseType: ResponseType;
  content: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: ConsultationResponseDto) {
    this.id = data.id;
    this.consultationId = data.consultationId;
    this.responderId = data.responderId;
    this.responderName = data.responderName;
    this.responseType = data.responseType;
    this.content = data.content;
    this.isPublic = data.isPublic;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static fromEntity(response: ConsultationResponse): ConsultationResponseDto {
    return new ConsultationResponseDto({
      id: response.id,
      consultationId: response.consultationId,
      responderId: response.responderId,
      responderName: response.responderName,
      responseType: response.responseType,
      content: response.content,
      isPublic: response.isPublic,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    });
  }
}
