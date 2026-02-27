import { User } from '@/core/domain/entities/User';
import type { IUserRepository } from '@/core/domain/repositories/IUserRepository';

export class GetUserByIdUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: number): Promise<User | null> {
    return await this.userRepository.findById(id);
  }
}