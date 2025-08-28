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
import { IFinancialReportRepository } from '@/core/domain/repositories/IFinancialReportRepository';
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
import { PrismaFinancialReportRepository } from '../repositories/PrismaFinancialReportRepository';

// Services
import { IAuthService } from '@/core/domain/services/IAuthService';
import { JwtAuthService } from '../services/JwtAuthService.server';
import { FileUploadService } from '../services/FileUploadService';

// Use Cases
import { CreateUserUseCase } from '@/core/application/use-cases/CreateUserUseCase';
import { GetUserByIdUseCase } from '@/core/application/use-cases/GetUserByIdUseCase';
import { LoginUseCase } from '@/core/application/use-cases/auth/LoginUseCase';
import { LogoutUseCase } from '@/core/application/use-cases/auth/LogoutUseCase';
import { RefreshTokenUseCase } from '@/core/application/use-cases/auth/RefreshTokenUseCase';
import { RegisterUseCase } from '@/core/application/use-cases/auth/RegisterUseCase';
import { CreateCategoryUseCase } from '@/core/application/use-cases/category/CreateCategoryUseCase';
import { GetCategoriesUseCase } from '@/core/application/use-cases/category/GetCategoriesUseCase';
import { CreateConsultationUseCase } from '@/core/application/use-cases/consultation/CreateConsultationUseCase';
import { GetConsultationUseCase } from '@/core/application/use-cases/consultation/GetConsultationUseCase';
import { GetConsultationsUseCase } from '@/core/application/use-cases/consultation/GetConsultationsUseCase';
import { GetConsultationStatsUseCase } from '@/core/application/use-cases/consultation/GetConsultationStatsUseCase';
import { CreateDonationUseCase } from '@/core/application/use-cases/donation/CreateDonationUseCase';
import { GetDonationsUseCase } from '@/core/application/use-cases/donation/GetDonationsUseCase';
import { CreatePostUseCase } from '@/core/application/use-cases/post/CreatePostUseCase';
import { GetPostUseCase } from '@/core/application/use-cases/post/GetPostUseCase';
import { GetPostsUseCase } from '@/core/application/use-cases/post/GetPostsUseCase';
import { SearchPostsUseCase } from '@/core/application/use-cases/post/SearchPostsUseCase';
import { CreateSponsorUseCase } from '@/core/application/use-cases/sponsor/CreateSponsorUseCase';
import { GetMainBannersUseCase } from '@/core/application/use-cases/main-banner/GetMainBannersUseCase';
import { GetQuickLinksUseCase } from '@/core/application/use-cases/quick-link/GetQuickLinksUseCase';
import { GetLatestFinancialReportUseCase } from '@/core/application/use-cases/financial-report/GetLatestFinancialReportUseCase';

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

container.register<IFinancialReportRepository>('IFinancialReportRepository', {
  useClass: PrismaFinancialReportRepository
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

// Register Use Cases
// User Use Cases
container.register<CreateUserUseCase>(CreateUserUseCase, { useClass: CreateUserUseCase });
container.register<GetUserByIdUseCase>(GetUserByIdUseCase, { useClass: GetUserByIdUseCase });

// Auth Use Cases
container.register<LoginUseCase>(LoginUseCase, { useClass: LoginUseCase });
container.register<LogoutUseCase>(LogoutUseCase, { useClass: LogoutUseCase });
container.register<RefreshTokenUseCase>(RefreshTokenUseCase, { useClass: RefreshTokenUseCase });
container.register<RegisterUseCase>(RegisterUseCase, { useClass: RegisterUseCase });

// Category Use Cases
container.register<CreateCategoryUseCase>(CreateCategoryUseCase, { useClass: CreateCategoryUseCase });
container.register<GetCategoriesUseCase>(GetCategoriesUseCase, { useClass: GetCategoriesUseCase });

// Consultation Use Cases
container.register<CreateConsultationUseCase>(CreateConsultationUseCase, { useClass: CreateConsultationUseCase });
container.register<GetConsultationUseCase>(GetConsultationUseCase, { useClass: GetConsultationUseCase });
container.register<GetConsultationsUseCase>(GetConsultationsUseCase, { useClass: GetConsultationsUseCase });
container.register<GetConsultationStatsUseCase>(GetConsultationStatsUseCase, { useClass: GetConsultationStatsUseCase });

// Donation Use Cases
container.register<CreateDonationUseCase>(CreateDonationUseCase, { useClass: CreateDonationUseCase });
container.register<GetDonationsUseCase>(GetDonationsUseCase, { useClass: GetDonationsUseCase });

// Post Use Cases
container.register<CreatePostUseCase>(CreatePostUseCase, { useClass: CreatePostUseCase });
container.register<GetPostUseCase>(GetPostUseCase, { useClass: GetPostUseCase });
container.register<GetPostsUseCase>(GetPostsUseCase, { useClass: GetPostsUseCase });
container.register<SearchPostsUseCase>(SearchPostsUseCase, { useClass: SearchPostsUseCase });

// Sponsor Use Cases
container.register<CreateSponsorUseCase>(CreateSponsorUseCase, { useClass: CreateSponsorUseCase });

// Home Page Use Cases
container.register<GetMainBannersUseCase>(GetMainBannersUseCase, { useClass: GetMainBannersUseCase });
container.register<GetQuickLinksUseCase>(GetQuickLinksUseCase, { useClass: GetQuickLinksUseCase });
container.register<GetLatestFinancialReportUseCase>(GetLatestFinancialReportUseCase, { useClass: GetLatestFinancialReportUseCase });

export { container };