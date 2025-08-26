import 'reflect-metadata';
import { container } from 'tsyringe';

// Repositories
import { IUserRepository } from '@/core/domain/repositories/IUserRepository';
import { IRefreshTokenRepository } from '@/core/domain/repositories/IRefreshTokenRepository';
import { ICategoryRepository } from '@/core/domain/repositories/ICategoryRepository';
import { IPostRepository } from '@/core/domain/repositories/IPostRepository';
import { IConsultationRepository } from '@/core/domain/repositories/IConsultationRepository';
import { ISponsorRepository } from '@/core/domain/repositories/ISponsorRepository';
import { IDonationRepository } from '@/core/domain/repositories/IDonationRepository';
import { IUserProfileRepository } from '@/core/domain/repositories/IUserProfileRepository';
import { IAttachmentRepository } from '@/core/domain/repositories/IAttachmentRepository';
import { IFAQRepository } from '@/core/domain/repositories/IFAQRepository';
import { IMenuRepository } from '@/core/domain/repositories/IMenuRepository';
import { INewsletterSubscriberRepository } from '@/core/domain/repositories/INewsletterSubscriberRepository';
import { IMainBannerRepository } from '@/core/domain/repositories/IMainBannerRepository';
import { IQuickLinkRepository } from '@/core/domain/repositories/IQuickLinkRepository';
import { PrismaUserRepository } from '../repositories/PrismaUserRepository';
import { UserRepositoryMySQL } from '../repositories/mysql/UserRepositoryMySQL';
import { PrismaRefreshTokenRepository } from '../repositories/PrismaRefreshTokenRepository';
import { PrismaCategoryRepository } from '../repositories/PrismaCategoryRepository';
import { PrismaPostRepository } from '../repositories/PrismaPostRepository';
import { PrismaConsultationRepository } from '../repositories/PrismaConsultationRepository';
import { PrismaSponsorRepository } from '../repositories/PrismaSponsorRepository';
import { PrismaDonationRepository } from '../repositories/PrismaDonationRepository';
import { PrismaUserProfileRepository } from '../repositories/PrismaUserProfileRepository';
import { PrismaAttachmentRepository } from '../repositories/PrismaAttachmentRepository';
import { PrismaFAQRepository } from '../repositories/PrismaFAQRepository';
import { PrismaMenuRepository } from '../repositories/PrismaMenuRepository';
import { PrismaNewsletterSubscriberRepository } from '../repositories/PrismaNewsletterSubscriberRepository';
import { PrismaMainBannerRepository } from '../repositories/PrismaMainBannerRepository';
import { PrismaQuickLinkRepository } from '../repositories/PrismaQuickLinkRepository';

// Services
import { IAuthService } from '@/core/domain/services/IAuthService';
import { JwtAuthService } from '../services/JwtAuthService.server';
import { FileUploadService } from '../services/FileUploadService';

// Repository implementations
// Use MySQL repository for local development with sha256_password
const useMySQLRepository = process.env.DATABASE_URL?.includes('localhost:3307') && 
                          process.env.USE_MYSQL_DIRECT === 'true';

container.register<IUserRepository>('IUserRepository', {
  useClass: useMySQLRepository ? UserRepositoryMySQL : PrismaUserRepository
});

container.register<IRefreshTokenRepository>('IRefreshTokenRepository', {
  useClass: PrismaRefreshTokenRepository
});

container.register<ICategoryRepository>('ICategoryRepository', {
  useClass: PrismaCategoryRepository
});

container.register<IPostRepository>('IPostRepository', {
  useClass: PrismaPostRepository
});

container.register<IConsultationRepository>('IConsultationRepository', {
  useClass: PrismaConsultationRepository
});

container.register<ISponsorRepository>('ISponsorRepository', {
  useClass: PrismaSponsorRepository
});

container.register<IDonationRepository>('IDonationRepository', {
  useClass: PrismaDonationRepository
});

container.register<IUserProfileRepository>('IUserProfileRepository', {
  useClass: PrismaUserProfileRepository
});

container.register<IAttachmentRepository>('IAttachmentRepository', {
  useClass: PrismaAttachmentRepository
});

container.register<IFAQRepository>('IFAQRepository', {
  useClass: PrismaFAQRepository
});

container.register<IMenuRepository>('IMenuRepository', {
  useClass: PrismaMenuRepository
});

container.register<INewsletterSubscriberRepository>('INewsletterSubscriberRepository', {
  useClass: PrismaNewsletterSubscriberRepository
});

container.register<IMainBannerRepository>('IMainBannerRepository', {
  useClass: PrismaMainBannerRepository
});

container.register<IQuickLinkRepository>('IQuickLinkRepository', {
  useClass: PrismaQuickLinkRepository
});

// Service implementations
container.register<IAuthService>('IAuthService', {
  useFactory: (c) => {
    const refreshTokenRepository = c.resolve<IRefreshTokenRepository>('IRefreshTokenRepository');
    return new JwtAuthService(
      refreshTokenRepository,
      process.env.JWT_ACCESS_SECRET || 'default-access-secret',
      process.env.JWT_REFRESH_SECRET || 'default-refresh-secret'
    );
  }
});

container.register<FileUploadService>('FileUploadService', {
  useClass: FileUploadService
});

export { container };