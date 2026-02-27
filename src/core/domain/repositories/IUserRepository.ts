import { User } from '../entities/User';

interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
  update(user: User): Promise<void>;
  delete(id: number): Promise<void>;
  findAll(): Promise<User[]>;
}

export type { IUserRepository };