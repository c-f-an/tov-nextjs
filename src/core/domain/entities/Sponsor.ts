export enum SponsorType {
  individual = 'individual',
  organization = 'organization'
}

export enum SponsorStatus {
  active = 'active',
  inactive = 'inactive',
  paused = 'paused'
}

export class Sponsor {
  constructor(
    public readonly id: number,
    public readonly userId: number | null,
    public readonly sponsorType: SponsorType,
    public readonly name: string,
    public readonly organizationName: string | null,
    public readonly phone: string | null,
    public readonly email: string | null,
    public readonly address: string | null,
    public readonly postcode: string | null,
    public readonly sponsorStatus: SponsorStatus,
    public readonly privacyAgree: boolean,
    public readonly receiptRequired: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}