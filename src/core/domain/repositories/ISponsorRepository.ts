import { Sponsor } from '../entities/Sponsor';

interface ISponsorRepository {
  save(sponsor: Sponsor): Promise<Sponsor>;
  findById(id: number): Promise<Sponsor | null>;
  findByUserId(userId: number): Promise<Sponsor[]>;
  findAll(): Promise<Sponsor[]>;
  delete(id: number): Promise<void>;
}

export type { ISponsorRepository };