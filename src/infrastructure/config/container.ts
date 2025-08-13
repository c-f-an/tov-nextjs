import 'server-only';
import { IUserRepository } from '@/core/domain/repositories/IUserRepository';
import { IRefreshTokenRepository } from '@/core/domain/repositories/IRefreshTokenRepository';
import { IAuthService } from '@/core/domain/services/IAuthService';
import { CreateUserUseCase } from '@/core/application/use-cases/CreateUserUseCase';
import { GetUserByIdUseCase } from '@/core/application/use-cases/GetUserByIdUseCase';
import { LoginUseCase } from '@/core/application/use-cases/auth/LoginUseCase';
import { RegisterUseCase } from '@/core/application/use-cases/auth/RegisterUseCase';
import { RefreshTokenUseCase } from '@/core/application/use-cases/auth/RefreshTokenUseCase';
import { LogoutUseCase } from '@/core/application/use-cases/auth/LogoutUseCase';
import { PrismaUserRepository } from '../repositories/PrismaUserRepository';
import { PrismaRefreshTokenRepository } from '../repositories/PrismaRefreshTokenRepository';
import { JwtAuthService } from '../services/JwtAuthService.server';

export class Container {
  private static instance: Container;
  private userRepository: IUserRepository;
  private refreshTokenRepository: IRefreshTokenRepository;
  private authService: IAuthService;

  private constructor() {
    // Initialize repositories
    this.userRepository = new PrismaUserRepository();
    this.refreshTokenRepository = new PrismaRefreshTokenRepository();
    
    // Initialize services
    this.authService = new JwtAuthService(
      this.refreshTokenRepository,
      process.env.JWT_ACCESS_SECRET || 'default-access-secret',
      process.env.JWT_REFRESH_SECRET || 'default-refresh-secret'
    );
  }

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  // Repositories
  getUserRepository(): IUserRepository {
    return this.userRepository;
  }

  getRefreshTokenRepository(): IRefreshTokenRepository {
    return this.refreshTokenRepository;
  }

  // Services
  getAuthService(): IAuthService {
    return this.authService;
  }

  // Use Cases
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
    return new RegisterUseCase(this.userRepository, this.authService);
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
}