import { IResourceRepository, ResourceFilter, PaginationOptions, PaginatedResult } from '@/core/domain/repositories/IResourceRepository';
import { Resource, ResourceType } from '@/core/domain/entities/Resource';
import { ResourceFile } from '@/core/domain/entities/ResourceFile';
import { pool } from '@/infrastructure/database/mysql';

export class MySQLResourceRepository implements IResourceRepository {

  async findAll(filter?: ResourceFilter, pagination?: PaginationOptions): Promise<PaginatedResult<Resource>> {
    const page = Number(pagination?.page || 1);
    const limit = Number(pagination?.limit || 10);
    const offset = (page - 1) * limit;

    // Whitelist allowed orderBy columns to prevent SQL injection
    const allowedOrderColumns = ['created_at', 'updated_at', 'published_at', 'title', 'download_count', 'view_count', 'resource_type'];

    // Handle multiple column ordering (e.g., "resource_type,published_at")
    let orderClauseColumns: string[] = [];
    if (pagination?.orderBy) {
      const orderColumns = pagination.orderBy.split(',').map(col => col.trim());
      orderClauseColumns = orderColumns.filter(col => allowedOrderColumns.includes(col));
    }

    // Use provided columns or default to published_at
    const orderBy = orderClauseColumns.length > 0
      ? orderClauseColumns.map(col => `r.${col}`).join(', ')
      : 'r.published_at';

    const orderDirection = pagination?.orderDirection === 'ASC' ? 'ASC' : 'DESC';

    let whereConditions: string[] = [];
    let params: any[] = [];

    if (filter) {
      if (filter.categoryId !== undefined) {
        whereConditions.push('r.category_id = ?');
        params.push(filter.categoryId);
      }
      if (filter.resourceType !== undefined) {
        whereConditions.push('r.resource_type = ?');
        params.push(filter.resourceType);
      }
      if (filter.isFeatured !== undefined) {
        whereConditions.push('r.is_featured = ?');
        params.push(Number(filter.isFeatured));
      }
      if (filter.isActive !== undefined) {
        whereConditions.push('r.is_active = ?');
        params.push(Number(filter.isActive));
      }
      if (filter.searchTerm) {
        whereConditions.push('(r.title LIKE ? OR r.description LIKE ?)');
        params.push(`%${filter.searchTerm}%`, `%${filter.searchTerm}%`);
      }
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM resources r ${whereClause}`;
    const [countResult] = params.length > 0
      ? await pool.execute(countQuery, params)
      : await pool.query(countQuery);
    const total = (countResult as any)[0].total;

    // Get paginated results with category
    // Build order clause safely (orderBy already includes 'r.' prefix)
    const orderClause = `ORDER BY ${orderBy} ${orderDirection}`;

    // Build the main query with placeholders or direct values
    let mainQuery: string;
    let queryParams: any[];

    // Build query with direct LIMIT/OFFSET values to avoid mysql2 parameter issues
    mainQuery = `SELECT r.*, rc.name as category_name, rc.slug as category_slug
     FROM resources r
     LEFT JOIN resource_categories rc ON r.category_id = rc.id
     ${whereClause}
     ${orderClause}
     LIMIT ${limit} OFFSET ${offset}`;

    // Execute query with params only for WHERE conditions
    const [rows] = params.length > 0
      ? await pool.execute(mainQuery, params)
      : await pool.query(mainQuery);

    const items = (rows as any[]).map(row => this.mapRowToEntity(row));

    // Load files for all resources in one query
    if (items.length > 0) {
      const resourceIds = items.map(item => item.id);
      const placeholders = resourceIds.map(() => '?').join(',');
      const [fileRows] = await pool.execute(
        `SELECT * FROM resource_files WHERE resource_id IN (${placeholders}) ORDER BY sort_order ASC, created_at ASC`,
        resourceIds
      );

      // Group files by resource_id
      const filesByResourceId = new Map<number, ResourceFile[]>();
      for (const fileRow of fileRows as any[]) {
        const resourceId = fileRow.resource_id;
        if (!filesByResourceId.has(resourceId)) {
          filesByResourceId.set(resourceId, []);
        }
        filesByResourceId.get(resourceId)!.push(new ResourceFile(
          fileRow.id,
          fileRow.resource_id,
          fileRow.file_path,
          fileRow.original_filename,
          fileRow.file_type,
          fileRow.file_size,
          fileRow.sort_order,
          fileRow.download_count,
          new Date(fileRow.created_at)
        ));
      }

      // Assign files to each resource
      for (const item of items) {
        item.files = filesByResourceId.get(item.id) || [];
      }
    }

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findById(id: number): Promise<Resource | null> {
    const [rows] = await pool.execute(
      `SELECT r.*, rc.name as category_name, rc.slug as category_slug
       FROM resources r
       LEFT JOIN resource_categories rc ON r.category_id = rc.id
       WHERE r.id = ?`,
      [id]
    );
    const row = (rows as any[])[0];
    if (!row) return null;

    const resource = this.mapRowToEntity(row);

    // Load files from resource_files table
    const [fileRows] = await pool.execute(
      'SELECT * FROM resource_files WHERE resource_id = ? ORDER BY sort_order ASC, created_at ASC',
      [id]
    );
    resource.files = (fileRows as any[]).map(fileRow => new ResourceFile(
      fileRow.id,
      fileRow.resource_id,
      fileRow.file_path,
      fileRow.original_filename,
      fileRow.file_type,
      fileRow.file_size,
      fileRow.sort_order,
      fileRow.download_count,
      new Date(fileRow.created_at)
    ));

    return resource;
  }

  async findByCategoryId(categoryId: number, pagination?: PaginationOptions): Promise<PaginatedResult<Resource>> {
    return this.findAll({ categoryId, isActive: true }, pagination);
  }

  async findFeatured(limit: number = 5): Promise<Resource[]> {
    const [rows] = await pool.execute(
      `SELECT r.*, rc.name as category_name, rc.slug as category_slug
       FROM resources r
       LEFT JOIN resource_categories rc ON r.category_id = rc.id
       WHERE r.is_featured = ? AND r.is_active = ?
       ORDER BY r.published_at DESC
       LIMIT ?`,
      [1, 1, limit]
    );
    return (rows as any[]).map(row => this.mapRowToEntity(row));
  }

  async create(resource: Resource): Promise<Resource> {
    const [result] = await pool.execute(
      `INSERT INTO resources
       (category_id, title, description, resource_type, file_type, file_path, file_size,
        original_filename, thumbnail_path, external_link, external_link_title, download_count, view_count,
        is_featured, is_active, published_at, created_by, updated_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        resource.categoryId,
        resource.title,
        resource.description,
        resource.resourceType,
        resource.fileType,
        resource.filePath,
        resource.fileSize,
        resource.originalFilename,
        resource.thumbnailPath,
        resource.externalLink,
        resource.externalLinkTitle,
        resource.downloadCount,
        resource.viewCount,
        resource.isFeatured ? 1 : 0,
        resource.isActive ? 1 : 0,
        resource.publishedAt,
        resource.createdBy,
        resource.updatedBy
      ]
    );
    const insertId = (result as any).insertId;
    const created = await this.findById(insertId);
    if (!created) throw new Error('Failed to create resource');
    return created;
  }

  async update(resource: Resource): Promise<Resource> {
    await pool.execute(
      `UPDATE resources
       SET category_id = ?, title = ?, description = ?, resource_type = ?,
           file_type = ?, file_path = ?, file_size = ?, original_filename = ?,
           thumbnail_path = ?, external_link = ?, external_link_title = ?, is_featured = ?, is_active = ?,
           published_at = ?, updated_by = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        resource.categoryId,
        resource.title,
        resource.description,
        resource.resourceType,
        resource.fileType,
        resource.filePath,
        resource.fileSize,
        resource.originalFilename,
        resource.thumbnailPath,
        resource.externalLink,
        resource.externalLinkTitle,
        resource.isFeatured ? 1 : 0,
        resource.isActive ? 1 : 0,
        resource.publishedAt,
        resource.updatedBy,
        resource.id
      ]
    );
    const updated = await this.findById(resource.id);
    if (!updated) throw new Error('Failed to update resource');
    return updated;
  }

  async delete(id: number): Promise<void> {
    await pool.execute('DELETE FROM resources WHERE id = ?', [id]);
  }

  async incrementDownloadCount(id: number): Promise<void> {
    await pool.execute(
      'UPDATE resources SET download_count = download_count + 1 WHERE id = ?',
      [id]
    );
  }

  async incrementViewCount(id: number): Promise<void> {
    await pool.execute(
      'UPDATE resources SET view_count = view_count + 1 WHERE id = ?',
      [id]
    );
  }

  async logDownload(resourceId: number, userId: number | null, ipAddress: string, userAgent: string | null): Promise<void> {
    await pool.execute(
      `INSERT INTO resource_download_logs
       (resource_id, user_id, ip_address, user_agent, downloaded_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [resourceId, userId, ipAddress, userAgent]
    );
  }

  private mapRowToEntity(row: any): Resource {
    const resource = new Resource(
      row.id,
      row.category_id,
      row.title,
      row.description,
      row.resource_type as ResourceType,
      row.file_type,
      row.file_path,
      row.file_size,
      row.original_filename,
      row.thumbnail_path,
      row.external_link,
      row.external_link_title,
      row.download_count,
      row.view_count,
      Boolean(row.is_featured),
      Boolean(row.is_active),
      row.published_at ? new Date(row.published_at) : null,
      row.created_by,
      row.updated_by,
      new Date(row.created_at),
      new Date(row.updated_at)
    );

    // Add category if available
    if (row.category_name) {
      resource.category = {
        id: row.category_id,
        name: row.category_name,
        slug: row.category_slug
      };
    }

    return resource;
  }
}