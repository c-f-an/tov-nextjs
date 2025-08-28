import { Attachment } from '../entities/Attachment';

interface IAttachmentRepository {
  findById(id: number): Promise<Attachment | null>;
  findByAttachable(attachableType: string, attachableId: number): Promise<Attachment[]>;
  save(attachment: Attachment): Promise<Attachment>;
  update(attachment: Attachment): Promise<void>;
  delete(id: number): Promise<void>;
  deleteByAttachable(attachableType: string, attachableId: number): Promise<void>;
}

export type { IAttachmentRepository };