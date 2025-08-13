import { Attachment } from '@/core/domain/entities/Attachment';
import { IAttachmentRepository } from '@/core/domain/repositories/IAttachmentRepository';
import { prisma } from '../database/prisma';
import { Attachment as PrismaAttachment } from '@prisma/client';

export class PrismaAttachmentRepository implements IAttachmentRepository {
  private toDomain(prismaAttachment: PrismaAttachment): Attachment {
    return new Attachment(
      prismaAttachment.id,
      prismaAttachment.attachableType,
      prismaAttachment.attachableId,
      prismaAttachment.filename,
      prismaAttachment.originalFilename,
      prismaAttachment.path,
      prismaAttachment.mimeType,
      prismaAttachment.size,
      prismaAttachment.downloadCount,
      prismaAttachment.createdAt || new Date(),
      prismaAttachment.updatedAt || new Date()
    );
  }

  async findById(id: number): Promise<Attachment | null> {
    const attachment = await prisma.attachment.findUnique({
      where: { id }
    });

    return attachment ? this.toDomain(attachment) : null;
  }

  async findByAttachable(attachableType: string, attachableId: number): Promise<Attachment[]> {
    const attachments = await prisma.attachment.findMany({
      where: {
        attachableType,
        attachableId
      },
      orderBy: { createdAt: 'asc' }
    });

    return attachments.map(attachment => this.toDomain(attachment));
  }

  async save(attachment: Attachment): Promise<Attachment> {
    const savedAttachment = await prisma.attachment.create({
      data: {
        attachableType: attachment.attachableType,
        attachableId: attachment.attachableId,
        filename: attachment.filename,
        originalFilename: attachment.originalFilename,
        path: attachment.path,
        mimeType: attachment.mimeType,
        size: attachment.size,
        downloadCount: attachment.downloadCount
      }
    });

    return this.toDomain(savedAttachment);
  }

  async update(attachment: Attachment): Promise<void> {
    await prisma.attachment.update({
      where: { id: attachment.id },
      data: {
        filename: attachment.filename,
        originalFilename: attachment.originalFilename,
        path: attachment.path,
        mimeType: attachment.mimeType,
        size: attachment.size,
        downloadCount: attachment.downloadCount
      }
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.attachment.delete({
      where: { id }
    });
  }

  async deleteByAttachable(attachableType: string, attachableId: number): Promise<void> {
    await prisma.attachment.deleteMany({
      where: {
        attachableType,
        attachableId
      }
    });
  }
}