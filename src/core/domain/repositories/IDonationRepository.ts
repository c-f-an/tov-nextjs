import { Donation, DonationStatus, DonationType } from '../entities/Donation';
import { PaginatedResult, PaginationParams } from './IPostRepository';

export interface DonationFilters {
  userId?: string;
  type?: DonationType;
  status?: DonationStatus;
  amountMin?: number;
  amountMax?: number;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface DonationStats {
  totalAmount: number;
  totalDonors: number;
  regularDonors: number;
  onetimeDonors: number;
  averageAmount: number;
}

export interface IDonationRepository {
  findById(id: string): Promise<Donation | null>;
  findByUserId(userId: string, pagination: PaginationParams): Promise<PaginatedResult<Donation>>;
  findAll(filters: DonationFilters, pagination: PaginationParams): Promise<PaginatedResult<Donation>>;
  findDueForPayment(date: Date): Promise<Donation[]>;
  save(donation: Donation): Promise<void>;
  update(donation: Donation): Promise<void>;
  delete(id: string): Promise<void>;
  getStats(dateFrom?: Date, dateTo?: Date): Promise<DonationStats>;
}