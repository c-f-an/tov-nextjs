import { User } from '@/core/domain/entities/User';
import type { IUserRepository } from '@/core/domain/repositories/IUserRepository';
import { CreateUserDto } from '../dto/CreateUserDto';

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const user = User.create({
      email: dto.email,
      name: dto.name,
    });

    await this.userRepository.save(user);
    
    return user;
  }
}