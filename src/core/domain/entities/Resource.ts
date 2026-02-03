import { ResourceFile } from './ResourceFile';

export type ResourceType = 'guide' | 'form' | 'education' | 'law' | 'etc';

export class Resource {
  // Files relation (multiple files support)
  public files?: ResourceFile[];

  constructor(
    public readonly id: number,
    public categoryId: number,
    public title: string,
    public description: string | null,
    public resourceType: ResourceType,
    public fileType: string | null,
    public filePath: string | null,
    public fileSize: number | null,
    public originalFilename: string | null,
    public thumbnailPath: string | null,
    public externalLink: string | null,
    public externalLinkTitle: string | null,
    public downloadCount: number,
    public viewCount: number,
    public isFeatured: boolean,
    public isActive: boolean,
    public publishedAt: Date | null,
    public createdBy: number | null,
    public updatedBy: number | null,
    public readonly createdAt: Date,
    public updatedAt: Date,
    // Relations
    public category?: any,
    public tags?: any[]
  ) {}

  static create(
    categoryId: number,
    title: string,
    resourceType: ResourceType = 'etc',
    description: string | null = null,
    createdBy: number | null = null
  ): Resource {
    const now = new Date();
    return new Resource(
      0, // ID will be assigned by database
      categoryId,
      title,
      description,
      resourceType,
      null, // fileType
      null, // filePath
      null, // fileSize
      null, // originalFilename
      null, // thumbnailPath
      null, // externalLink
      null, // externalLinkTitle
      0, // downloadCount
      0, // viewCount
      false, // isFeatured
      true, // isActive
      now, // publishedAt
      createdBy,
      null, // updatedBy
      now,
      now
    );
  }

  update(data: Partial<{
    categoryId: number;
    title: string;
    description: string | null;
    resourceType: ResourceType;
    fileType: string | null;
    filePath: string | null;
    fileSize: number | null;
    originalFilename: string | null;
    thumbnailPath: string | null;
    externalLink: string | null;
    externalLinkTitle: string | null;
    isFeatured: boolean;
    isActive: boolean;
    publishedAt: Date | null;
  }>, updatedBy: number | null = null): void {
    if (data.categoryId !== undefined) this.categoryId = data.categoryId;
    if (data.title !== undefined) this.title = data.title;
    if (data.description !== undefined) this.description = data.description;
    if (data.resourceType !== undefined) this.resourceType = data.resourceType;
    if (data.fileType !== undefined) this.fileType = data.fileType;
    if (data.filePath !== undefined) this.filePath = data.filePath;
    if (data.fileSize !== undefined) this.fileSize = data.fileSize;
    if (data.originalFilename !== undefined) this.originalFilename = data.originalFilename;
    if (data.thumbnailPath !== undefined) this.thumbnailPath = data.thumbnailPath;
    if (data.externalLink !== undefined) this.externalLink = data.externalLink;
    if (data.externalLinkTitle !== undefined) this.externalLinkTitle = data.externalLinkTitle;
    if (data.isFeatured !== undefined) this.isFeatured = data.isFeatured;
    if (data.isActive !== undefined) this.isActive = data.isActive;
    if (data.publishedAt !== undefined) this.publishedAt = data.publishedAt;

    this.updatedBy = updatedBy;
    this.updatedAt = new Date();
  }

  setFile(
    filePath: string,
    originalFilename: string,
    fileType: string,
    fileSize: number
  ): void {
    this.filePath = filePath;
    this.originalFilename = originalFilename;
    this.fileType = fileType;
    this.fileSize = fileSize;
    this.updatedAt = new Date();
  }

  incrementDownloadCount(): void {
    this.downloadCount++;
  }

  incrementViewCount(): void {
    this.viewCount++;
  }

  publish(): void {
    this.isActive = true;
    this.publishedAt = new Date();
    this.updatedAt = new Date();
  }

  unpublish(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  toggleFeatured(): void {
    this.isFeatured = !this.isFeatured;
    this.updatedAt = new Date();
  }

  hasFile(): boolean {
    return !!this.filePath || (this.files?.length ?? 0) > 0;
  }

  hasFiles(): boolean {
    return (this.files?.length ?? 0) > 0;
  }

  getFilesCount(): number {
    return this.files?.length ?? (this.filePath ? 1 : 0);
  }

  setFiles(files: ResourceFile[]): void {
    this.files = files;
  }

  getFirstFile(): ResourceFile | null {
    return this.files?.[0] ?? null;
  }

  hasExternalLink(): boolean {
    return !!this.externalLink;
  }

  getDownloadUrl(): string | null {
    if (this.externalLink) {
      return this.externalLink;
    }
    if (this.filePath) {
      return `/api/resources/${this.id}/download`;
    }
    return null;
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
}