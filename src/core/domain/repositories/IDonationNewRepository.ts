import { Donation } from '../entities/DonationNew';

interface FindPaginatedOptions {
  sponsorId?: number;
  offset: number;
  limit: number;
  startDate?: Date;
  endDate?: Date;
}

export interface IDonationRepository {
  save(donation: Donation): Promise<Donation>;
  findById(id: number): Promise<Donation | null>;
  findBySponsorId(sponsorId: number): Promise<Donation[]>;
  findPaginated(options: FindPaginatedOptions): Promise<{ donations: Donation[]; total: number; totalAmount: number }>;
  delete(id: number): Promise<void>;
}