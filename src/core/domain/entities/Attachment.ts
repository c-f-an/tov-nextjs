export class Attachment {
  constructor(
    public readonly id: number,
    public readonly attachableType: string,
    public readonly attachableId: number,
    public readonly filename: string,
    public readonly originalFilename: string,
    public readonly path: string,
    public mimeType: string | null,
    public size: bigint | null,
    public downloadCount: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(data: {
    attachableType: string;
    attachableId: number;
    filename: string;
    originalFilename: string;
    path: string;
    mimeType?: string | null;
    size?: bigint | null;
  }): Attachment {
    return new Attachment(
      0,
      data.attachableType,
      data.attachableId,
      data.filename,
      data.originalFilename,
      data.path,
      data.mimeType || null,
      data.size || null,
      0,
      new Date(),
      new Date()
    );
  }

  incrementDownloadCount(): void {
    this.downloadCount++;
  }

  getFileExtension(): string {
    const parts = this.filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
  }

  isImage(): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    const extension = this.getFileExtension();
    return imageExtensions.includes(extension);
  }

  isDocument(): boolean {
    const docExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];
    const extension = this.getFileExtension();
    return docExtensions.includes(extension);
  }

  getFormattedSize(): string {
    if (!this.size) return '0 B';
    
    const bytes = Number(this.size);
    const units = ['B', 'KB', 'MB', 'GB'];
    let index = 0;
    let size = bytes;

    while (size >= 1024 && index < units.length - 1) {
      size /= 1024;
      index++;
    }

    return `${size.toFixed(2)} ${units[index]}`;
  }
}