export class ResourceFile {
  constructor(
    public readonly id: number,
    public resourceId: number,
    public filePath: string,
    public originalFilename: string,
    public fileType: string,
    public fileSize: number,
    public sortOrder: number,
    public downloadCount: number,
    public readonly createdAt: Date
  ) {}

  static create(data: {
    resourceId: number;
    filePath: string;
    originalFilename: string;
    fileType: string;
    fileSize: number;
    sortOrder?: number;
  }): ResourceFile {
    return new ResourceFile(
      0, // ID will be assigned by database
      data.resourceId,
      data.filePath,
      data.originalFilename,
      data.fileType,
      data.fileSize,
      data.sortOrder ?? 0,
      0, // downloadCount
      new Date()
    );
  }

  incrementDownloadCount(): void {
    (this as { downloadCount: number }).downloadCount++;
  }

  getFileSizeFormatted(): string {
    if (!this.fileSize) return 'N/A';

    const units = ['B', 'KB', 'MB', 'GB'];
    let size = this.fileSize;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  getFileExtension(): string {
    const parts = this.originalFilename.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
  }

  isImage(): boolean {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    return imageExtensions.includes(this.getFileExtension());
  }
}
