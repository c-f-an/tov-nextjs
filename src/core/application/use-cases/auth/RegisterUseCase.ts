import { User, LoginType } from '@/core/domain/entities/User';
import { UserProfile } from '@/core/domain/entities/UserProfile';
import type { IUserRepository } from '@/core/domain/repositories/IUserRepository';
import type { IUserProfileRepository } from '@/core/domain/repositories/IUserProfileRepository';
import type { IAuthService } from '@/core/domain/services/IAuthService';
import { RegisterDto, AuthResponseDto } from '../../dto/AuthDto';
import { Password } from '@/core/domain/value-objects/Password';
import { Email } from '@/core/domain/value-objects/Email';
import { PhoneNumber } from '@/core/domain/value-objects/PhoneNumber';

export class RegisterUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userProfileRepository: IUserProfileRepository,
    private readonly authService: IAuthService
  ) {}

  async execute(dto: RegisterDto, ipAddress?: string, userAgent?: string): Promise<AuthResponseDto> {
    // Validate email format
    const email = new Email(dto.email);
    
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email.getValue());
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Validate and hash password
    const hashedPassword = await Password.create(dto.password);

    // Validate phone number if provided
    let phoneNumber: PhoneNumber | undefined;
    if (dto.phoneNumber) {
      phoneNumber = new PhoneNumber(dto.phoneNumber);
    }

    // Create new user
    const user = User.create({
      email: email.getValue(),
      password: hashedPassword.getValue(),
      name: dto.name,
      phone: phoneNumber?.getValue(),
      username: null,
      loginType: LoginType.email,
      avatarUrl: null
    });

    // Save user
    await this.userRepository.save(user);

    // Get saved user to get the auto-generated ID
    const savedUser = await this.userRepository.findByEmail(email.getValue());
    if (!savedUser) {
      throw new Error('Failed to create user');
    }

    // Create user profile if additional data is provided
    if (dto.churchName || dto.position) {
      const userProfile = UserProfile.create({
        userId: savedUser.id,
        churchName: dto.churchName || null,
        position: dto.position || null,
        denomination: null,
        address: null,
        postcode: null,
        birthDate: null,
        gender: null,
        profileImage: null,
        newsletterSubscribe: false,
        marketingAgree: false,
        privacyAgreeDate: new Date(),
        termsAgreeDate: new Date()
      });

      await this.userProfileRepository.save(userProfile);
    }

    // Generate tokens
    const tokens = await this.authService.generateTokenPair({
      userId: savedUser.id,
      email: savedUser.email,
      loginType: savedUser.loginType
    }, userAgent, ipAddress);

    // TODO: Send verification email

    return {
      user: {
        id: savedUser.id,
        email: savedUser.email,
        name: savedUser.name,
        role: savedUser.role,
        loginType: savedUser.loginType,
        isEmailVerified: savedUser.isEmailVerified()
      },
      tokens
    };
  }
}