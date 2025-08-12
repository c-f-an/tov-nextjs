export interface IRefreshToken {
  id: number;
  userId: number;
  tokenHash: string;
  deviceInfo?: string | null;
  ipAddress?: string | null;
  expiresAt: Date;
  revokedAt?: Date | null;
  revokedReason?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export class RefreshToken implements IRefreshToken {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly tokenHash: string,
    public readonly expiresAt: Date,
    public readonly deviceInfo?: string | null,
    public readonly ipAddress?: string | null,
    public readonly revokedAt?: Date | null,
    public readonly revokedReason?: string | null,
    public readonly createdAt?: Date | null,
    public readonly updatedAt?: Date | null
  ) {}

  static create(tokenHash: string, userId: number, deviceInfo?: string, ipAddress?: string, expiresInDays: number = 7): RefreshToken {
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    return new RefreshToken(
      0, // Auto-increment ID
      userId,
      tokenHash,
      expiresAt,
      deviceInfo,
      ipAddress,
      null,
      null,
      now,
      now
    );
  }

  revoke(reason?: string): RefreshToken {
    return new RefreshToken(
      this.id,
      this.userId,
      this.tokenHash,
      this.expiresAt,
      this.deviceInfo,
      this.ipAddress,
      new Date(),
      reason || 'Manual revocation',
      this.createdAt,
      new Date()
    );
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  isRevoked(): boolean {
    return this.revokedAt !== null;
  }

  isValid(): boolean {
    return !this.isRevoked() && !this.isExpired();
  }
}