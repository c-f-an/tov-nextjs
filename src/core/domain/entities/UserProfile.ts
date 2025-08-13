export class UserProfile {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public churchName: string | null,
    public position: string | null,
    public denomination: string | null,
    public address: string | null,
    public postcode: string | null,
    public birthDate: Date | null,
    public gender: 'M' | 'F' | null,
    public profileImage: string | null,
    public newsletterSubscribe: boolean,
    public marketingAgree: boolean,
    public privacyAgreeDate: Date | null,
    public termsAgreeDate: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(data: {
    userId: number;
    churchName?: string | null;
    position?: string | null;
    denomination?: string | null;
    address?: string | null;
    postcode?: string | null;
    birthDate?: Date | null;
    gender?: 'M' | 'F' | null;
    profileImage?: string | null;
    newsletterSubscribe?: boolean;
    marketingAgree?: boolean;
    privacyAgreeDate?: Date | null;
    termsAgreeDate?: Date | null;
  }): UserProfile {
    return new UserProfile(
      0,
      data.userId,
      data.churchName || null,
      data.position || null,
      data.denomination || null,
      data.address || null,
      data.postcode || null,
      data.birthDate || null,
      data.gender || null,
      data.profileImage || null,
      data.newsletterSubscribe || false,
      data.marketingAgree || false,
      data.privacyAgreeDate || null,
      data.termsAgreeDate || null,
      new Date(),
      new Date()
    );
  }

  updateProfileInfo(data: {
    churchName?: string | null;
    position?: string | null;
    denomination?: string | null;
    address?: string | null;
    postcode?: string | null;
    birthDate?: Date | null;
    gender?: 'M' | 'F' | null;
  }): void {
    if (data.churchName !== undefined) this.churchName = data.churchName;
    if (data.position !== undefined) this.position = data.position;
    if (data.denomination !== undefined) this.denomination = data.denomination;
    if (data.address !== undefined) this.address = data.address;
    if (data.postcode !== undefined) this.postcode = data.postcode;
    if (data.birthDate !== undefined) this.birthDate = data.birthDate;
    if (data.gender !== undefined) this.gender = data.gender;
  }

  updateProfileImage(imagePath: string | null): void {
    this.profileImage = imagePath;
  }

  updateNewsletterSubscription(subscribe: boolean): void {
    this.newsletterSubscribe = subscribe;
  }

  updateMarketingAgreement(agree: boolean): void {
    this.marketingAgree = agree;
  }

  agreeToPrivacyPolicy(): void {
    this.privacyAgreeDate = new Date();
  }

  agreeToTerms(): void {
    this.termsAgreeDate = new Date();
  }
}