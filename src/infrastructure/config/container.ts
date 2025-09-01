import 'server-only';
// Repositories
import { IUserRepository } from '@/core/domain/repositories/IUserRepository';
import { IUserProfileRepository } from '@/core/domain/repositories/IUserProfileRepository';
import { IRefreshTokenRepository } from '@/core/domain/repositories/IRefreshTokenRepository';
import { ICategoryRepository } from '@/core/domain/repositories/ICategoryRepository';
import { IPostRepository } from '@/core/domain/repositories/IPostRepository';
import { IConsultationRepository } from '@/core/domain/repositories/IConsultationRepository';
import { ISponsorRepository } from '@/core/domain/repositories/ISponsorRepository';
import { IDonationRepository } from '@/core/domain/repositories/IDonationRepository';
import { IAttachmentRepository } from '@/core/domain/repositories/IAttachmentRepository';
import { IFAQRepository } from '@/core/domain/repositories/IFAQRepository';
import { IMenuRepository } from '@/core/domain/repositories/IMenuRepository';
import { INewsletterSubscriberRepository } from '@/core/domain/repositories/INewsletterSubscriberRepository';
import { IMainBannerRepository } from '@/core/domain/repositories/IMainBannerRepository';
import { IQuickLinkRepository } from '@/core/domain/repositories/IQuickLinkRepository';
import { IFinancialReportRepository } from '@/core/domain/repositories/IFinancialReportRepository';

// Services
import { IAuthService } from '@/core/domain/services/IAuthService';

// Use Cases
import { CreateUserUseCase } from '@/core/application/use-cases/CreateUserUseCase';
import { GetUserByIdUseCase } from '@/core/application/use-cases/GetUserByIdUseCase';
import { LoginUseCase } from '@/core/application/use-cases/auth/LoginUseCase';
import { RegisterUseCase } from '@/core/application/use-cases/auth/RegisterUseCase';
import { RefreshTokenUseCase } from '@/core/application/use-cases/auth/RefreshTokenUseCase';
import { LogoutUseCase } from '@/core/application/use-cases/auth/LogoutUseCase';
import { CreateCategoryUseCase } from '@/core/application/use-cases/category/CreateCategoryUseCase';
import { GetCategoriesUseCase } from '@/core/application/use-cases/category/GetCategoriesUseCase';
import { CreatePostUseCase } from '@/core/application/use-cases/post/CreatePostUseCase';
import { GetPostUseCase } from '@/core/application/use-cases/post/GetPostUseCase';
import { GetPostsUseCase } from '@/core/application/use-cases/post/GetPostsUseCase';
import { CreateConsultationUseCase } from '@/core/application/use-cases/consultation/CreateConsultationUseCase';
import { GetConsultationUseCase } from '@/core/application/use-cases/consultation/GetConsultationUseCase';
import { GetConsultationsUseCase } from '@/core/application/use-cases/consultation/GetConsultationsUseCase';
import { GetConsultationStatsUseCase } from '@/core/application/use-cases/consultation/GetConsultationStatsUseCase';
import { CreateSponsorUseCase } from '@/core/application/use-cases/sponsor/CreateSponsorUseCase';
import { CreateDonationUseCase } from '@/core/application/use-cases/donation/CreateDonationUseCase';
import { GetDonationsUseCase } from '@/core/application/use-cases/donation/GetDonationsUseCase';
import { GetMainBannersUseCase } from '@/core/application/use-cases/main-banner/GetMainBannersUseCase';
import { GetQuickLinksUseCase } from '@/core/application/use-cases/quick-link/GetQuickLinksUseCase';
import { GetLatestFinancialReportUseCase } from '@/core/application/use-cases/financial-report/GetLatestFinancialReportUseCase';

// MySQL Repository implementations
import { MySQLUserRepository } from '../repositories/MySQLUserRepository';
import { MySQLUserProfileRepository } from '../repositories/MySQLUserProfileRepository';
import { MySQLRefreshTokenRepository } from '../repositories/MySQLRefreshTokenRepository';
import { MySQLCategoryRepository } from '../repositories/MySQLCategoryRepository';
import { MySQLPostRepository } from '../repositories/MySQLPostRepository';
import { MySQLConsultationRepository } from '../repositories/MySQLConsultationRepository';
import { MySQLSponsorRepository } from '../repositories/MySQLSponsorRepository';
import { MySQLDonationRepository } from '../repositories/MySQLDonationRepository';
import { MySQLAttachmentRepository } from '../repositories/MySQLAttachmentRepository';
import { MySQLFAQRepository } from '../repositories/MySQLFAQRepository';
import { MySQLMenuRepository } from '../repositories/MySQLMenuRepository';
import { MySQLNewsletterSubscriberRepository } from '../repositories/MySQLNewsletterSubscriberRepository';
import { MySQLMainBannerRepository } from '../repositories/MySQLMainBannerRepository';
import { MySQLQuickLinkRepository } from '../repositories/MySQLQuickLinkRepository';
import { MySQLFinancialReportRepository } from '../repositories/MySQLFinancialReportRepository';

// Services
import { JwtAuthService } from '../services/JwtAuthService.server';
import { FileUploadService } from '../services/FileUploadService';

export class Container {
  private static instance: Container;
  
  // Repositories
  private userRepository: IUserRepository;
  private userProfileRepository: IUserProfileRepository;
  private refreshTokenRepository: IRefreshTokenRepository;
  private categoryRepository: ICategoryRepository;
  private postRepository: IPostRepository;
  private consultationRepository: IConsultationRepository;
  private sponsorRepository: ISponsorRepository;
  private donationRepository: IDonationRepository;
  private attachmentRepository: IAttachmentRepository;
  private faqRepository: IFAQRepository;
  private menuRepository: IMenuRepository;
  private newsletterSubscriberRepository: INewsletterSubscriberRepository;
  private mainBannerRepository: IMainBannerRepository;
  private quickLinkRepository: IQuickLinkRepository;
  private financialReportRepository: IFinancialReportRepository;
  
  // Services
  private authService: IAuthService;
  private fileUploadService: FileUploadService;

  private constructor() {
    // Initialize repositories
    this.userRepository = new MySQLUserRepository();
    this.userProfileRepository = new MySQLUserProfileRepository();
    this.refreshTokenRepository = new MySQLRefreshTokenRepository();
    this.categoryRepository = new MySQLCategoryRepository();
    this.postRepository = new MySQLPostRepository();
    this.consultationRepository = new MySQLConsultationRepository();
    this.sponsorRepository = new MySQLSponsorRepository();
    this.donationRepository = new MySQLDonationRepository();
    this.attachmentRepository = new MySQLAttachmentRepository();
    this.faqRepository = new MySQLFAQRepository();
    this.menuRepository = new MySQLMenuRepository();
    this.newsletterSubscriberRepository = new MySQLNewsletterSubscriberRepository();
    this.mainBannerRepository = new MySQLMainBannerRepository();
    this.quickLinkRepository = new MySQLQuickLinkRepository();
    this.financialReportRepository = new MySQLFinancialReportRepository();
    
    // Initialize services
    this.authService = new JwtAuthService(
      this.refreshTokenRepository,
      process.env.JWT_ACCESS_SECRET || 'default-access-secret',
      process.env.JWT_REFRESH_SECRET || 'default-refresh-secret'
    );
    this.fileUploadService = new FileUploadService();
  }

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  // Repository getters
  getUserRepository(): IUserRepository {
    return this.userRepository;
  }

  getUserProfileRepository(): IUserProfileRepository {
    return this.userProfileRepository;
  }

  getRefreshTokenRepository(): IRefreshTokenRepository {
    return this.refreshTokenRepository;
  }

  getCategoryRepository(): ICategoryRepository {
    return this.categoryRepository;
  }

  getPostRepository(): IPostRepository {
    return this.postRepository;
  }

  getConsultationRepository(): IConsultationRepository {
    return this.consultationRepository;
  }

  getSponsorRepository(): ISponsorRepository {
    return this.sponsorRepository;
  }

  getDonationRepository(): IDonationRepository {
    return this.donationRepository;
  }

  getAttachmentRepository(): IAttachmentRepository {
    return this.attachmentRepository;
  }

  getFAQRepository(): IFAQRepository {
    return this.faqRepository;
  }

  getMenuRepository(): IMenuRepository {
    return this.menuRepository;
  }

  getNewsletterSubscriberRepository(): INewsletterSubscriberRepository {
    return this.newsletterSubscriberRepository;
  }

  getMainBannerRepository(): IMainBannerRepository {
    return this.mainBannerRepository;
  }

  getQuickLinkRepository(): IQuickLinkRepository {
    return this.quickLinkRepository;
  }

  getFinancialReportRepository(): IFinancialReportRepository {
    return this.financialReportRepository;
  }

  // Service getters
  getAuthService(): IAuthService {
    return this.authService;
  }

  getFileUploadService(): FileUploadService {
    return this.fileUploadService;
  }

  // Use Case getters
  getCreateUserUseCase(): CreateUserUseCase {
    return new CreateUserUseCase(this.userRepository);
  }

  getGetUserByIdUseCase(): GetUserByIdUseCase {
    return new GetUserByIdUseCase(this.userRepository);
  }

  getLoginUseCase(): LoginUseCase {
    return new LoginUseCase(this.userRepository, this.authService);
  }

  getRegisterUseCase(): RegisterUseCase {
    return new RegisterUseCase(this.userRepository, this.userProfileRepository, this.authService);
  }

  getRefreshTokenUseCase(): RefreshTokenUseCase {
    return new RefreshTokenUseCase(
      this.userRepository,
      this.refreshTokenRepository,
      this.authService
    );
  }

  getLogoutUseCase(): LogoutUseCase {
    return new LogoutUseCase(this.authService);
  }

  getCreateCategoryUseCase(): CreateCategoryUseCase {
    return new CreateCategoryUseCase(this.categoryRepository);
  }

  getGetCategoriesUseCase(): GetCategoriesUseCase {
    return new GetCategoriesUseCase(this.categoryRepository);
  }

  getCreatePostUseCase(): CreatePostUseCase {
    return new CreatePostUseCase(this.postRepository, this.categoryRepository);
  }

  getGetPostUseCase(): GetPostUseCase {
    return new GetPostUseCase(this.postRepository);
  }

  getGetPostsUseCase(): GetPostsUseCase {
    return new GetPostsUseCase(this.postRepository);
  }

  getCreateConsultationUseCase(): CreateConsultationUseCase {
    return new CreateConsultationUseCase(this.consultationRepository);
  }

  getGetConsultationUseCase(): GetConsultationUseCase {
    return new GetConsultationUseCase(this.consultationRepository);
  }

  getGetConsultationsUseCase(): GetConsultationsUseCase {
    return new GetConsultationsUseCase(this.consultationRepository);
  }

  getCreateSponsorUseCase(): CreateSponsorUseCase {
    return new CreateSponsorUseCase(this.sponsorRepository);
  }

  getCreateDonationUseCase(): CreateDonationUseCase {
    return new CreateDonationUseCase(this.donationRepository, this.sponsorRepository);
  }

  getGetDonationsUseCase(): GetDonationsUseCase {
    return new GetDonationsUseCase(this.donationRepository);
  }

  getGetConsultationStatsUseCase(): GetConsultationStatsUseCase {
    return new GetConsultationStatsUseCase(this.consultationRepository);
  }

  getGetMainBannersUseCase(): GetMainBannersUseCase {
    return new GetMainBannersUseCase(this.mainBannerRepository);
  }

  getGetQuickLinksUseCase(): GetQuickLinksUseCase {
    return new GetQuickLinksUseCase(this.quickLinkRepository);
  }

  getGetLatestFinancialReportUseCase(): GetLatestFinancialReportUseCase {
    return new GetLatestFinancialReportUseCase(this.financialReportRepository);
  }
}