import { inject, injectable } from 'tsyringe';
import { Sponsor, SponsorType, SponsorStatus } from '@/core/domain/entities/Sponsor';
import { ISponsorRepository } from '@/core/domain/repositories/ISponsorRepository';
import { SponsorDto } from '../../dtos/SponsorDto';

interface CreateSponsorRequest {
  userId?: number;
  sponsorType: SponsorType;
  name: string;
  organizationName?: string;
  phone?: string;
  email?: string;
  address?: string;
  postcode?: string;
  receiptRequired?: boolean;
  privacyAgree: boolean;
}

@injectable()
export class CreateSponsorUseCase {
  constructor(
    @inject('ISponsorRepository')
    private sponsorRepository: ISponsorRepository
  ) {}

  async execute(request: CreateSponsorRequest): Promise<SponsorDto> {
    if (!request.privacyAgree) {
      throw new Error('Privacy agreement is required');
    }

    const sponsor = new Sponsor(
      0, // Will be assigned by database
      request.userId || null,
      request.sponsorType,
      request.name,
      request.organizationName || null,
      request.phone || null,
      request.email || null,
      request.address || null,
      request.postcode || null,
      SponsorStatus.active,
      request.privacyAgree,
      request.receiptRequired || false,
      new Date(),
      new Date()
    );

    const savedSponsor = await this.sponsorRepository.save(sponsor);

    return SponsorDto.fromEntity(savedSponsor);
  }
}