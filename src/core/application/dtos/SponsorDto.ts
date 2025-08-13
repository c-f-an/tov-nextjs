import { Sponsor, SponsorType, SponsorStatus } from '@/core/domain/entities/Sponsor';
import { UserDto } from './UserDto';

export class SponsorDto {
  id: number;
  userId: number | null;
  sponsorType: SponsorType;
  name: string;
  organizationName: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  postcode: string | null;
  sponsorStatus: SponsorStatus;
  privacyAgree: boolean;
  receiptRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: UserDto;

  constructor(data: SponsorDto) {
    this.id = data.id;
    this.userId = data.userId;
    this.sponsorType = data.sponsorType;
    this.name = data.name;
    this.organizationName = data.organizationName;
    this.phone = data.phone;
    this.email = data.email;
    this.address = data.address;
    this.postcode = data.postcode;
    this.sponsorStatus = data.sponsorStatus;
    this.privacyAgree = data.privacyAgree;
    this.receiptRequired = data.receiptRequired;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.user = data.user;
  }

  static fromEntity(sponsor: Sponsor, includeRelations?: { user?: UserDto }): SponsorDto {
    return new SponsorDto({
      id: sponsor.id,
      userId: sponsor.userId,
      sponsorType: sponsor.sponsorType,
      name: sponsor.name,
      organizationName: sponsor.organizationName,
      phone: sponsor.phone,
      email: sponsor.email,
      address: sponsor.address,
      postcode: sponsor.postcode,
      sponsorStatus: sponsor.sponsorStatus,
      privacyAgree: sponsor.privacyAgree,
      receiptRequired: sponsor.receiptRequired,
      createdAt: sponsor.createdAt,
      updatedAt: sponsor.updatedAt,
      user: includeRelations?.user
    });
  }
}