'use client';

import { useState } from 'react';
import { Container } from '@/infrastructure/config/container';
import { CreateUserDto } from '@/core/application/dto/CreateUserDto';
import { User } from '@/core/domain/entities/User';

export const useCreateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = async (dto: CreateUserDto): Promise<User | null> => {
    setLoading(true);
    setError(null);

    try {
      const container = Container.getInstance();
      const createUserUseCase = container.getCreateUserUseCase();
      const user = await createUserUseCase.execute(dto);
      return user;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createUser, loading, error };
};