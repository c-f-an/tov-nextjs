import { pool } from "../database/mysql";
import { Report, CreateReportDto, UpdateReportDto } from "@/core/models/Report";
import { RowDataPacket } from "mysql2";

export class ReportRepository {
  async findAll(type?: 'business' | 'finance'): Promise<Report[]> {
    try {
      let query = "SELECT * FROM reports WHERE is_active = true";
      const params: any[] = [];

      if (type) {
        query += " AND type = ?";
        params.push(type);
      }

      query += " ORDER BY year DESC, date DESC";

      const [rows] = await pool.execute<RowDataPacket[]>(query, params);
      return rows as Report[];
    } catch (error) {
      console.error("Error finding all reports:", error);
      throw error;
    }
  }

  async findByType(type: 'business' | 'finance'): Promise<Report[]> {
    try {
      const query = `
        SELECT * FROM reports
        WHERE type = ? AND is_active = true
        ORDER BY year DESC, date DESC
      `;

      const [rows] = await pool.execute<RowDataPacket[]>(query, [type]);
      return rows as Report[];
    } catch (error) {
      console.error(`Error finding ${type} reports:`, error);
      throw error;
    }
  }

  async findById(id: number): Promise<Report | null> {
    try {
      const query = "SELECT * FROM reports WHERE id = ? AND is_active = true";
      const [rows] = await pool.execute<RowDataPacket[]>(query, [id]);

      if (rows.length === 0) {
        return null;
      }

      return rows[0] as Report;
    } catch (error) {
      console.error("Error finding report by id:", error);
      throw error;
    }
  }

  async findByYear(year: string, type?: 'business' | 'finance'): Promise<Report[]> {
    try {
      let query = "SELECT * FROM reports WHERE year = ? AND is_active = true";
      const params: any[] = [year];

      if (type) {
        query += " AND type = ?";
        params.push(type);
      }

      query += " ORDER BY date DESC";

      const [rows] = await pool.execute<RowDataPacket[]>(query, params);
      return rows as Report[];
    } catch (error) {
      console.error("Error finding reports by year:", error);
      throw error;
    }
  }

  async incrementViews(id: number): Promise<void> {
    try {
      const query = "UPDATE reports SET views = views + 1 WHERE id = ?";
      await pool.execute(query, [id]);
    } catch (error) {
      console.error("Error incrementing views:", error);
      throw error;
    }
  }

  async create(report: CreateReportDto): Promise<Report> {
    try {
      const query = `
        INSERT INTO reports (title, year, date, type, summary, content, file_url, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;

      const values = [
        report.title,
        report.year,
        report.date,
        report.type,
        report.summary || null,
        report.content || null,
        report.file_url || null,
        report.is_active !== undefined ? report.is_active : true
      ];

      const [result] = await pool.execute(query, values);
      const insertId = (result as any).insertId;

      return await this.findById(insertId) as Report;
    } catch (error) {
      console.error("Error creating report:", error);
      throw error;
    }
  }

  async update(id: number, report: UpdateReportDto): Promise<Report | null> {
    try {
      const fields = [];
      const values = [];

      if (report.title !== undefined) {
        fields.push("title = ?");
        values.push(report.title);
      }
      if (report.year !== undefined) {
        fields.push("year = ?");
        values.push(report.year);
      }
      if (report.date !== undefined) {
        fields.push("date = ?");
        values.push(report.date);
      }
      if (report.type !== undefined) {
        fields.push("type = ?");
        values.push(report.type);
      }
      if (report.summary !== undefined) {
        fields.push("summary = ?");
        values.push(report.summary);
      }
      if (report.content !== undefined) {
        fields.push("content = ?");
        values.push(report.content);
      }
      if (report.file_url !== undefined) {
        fields.push("file_url = ?");
        values.push(report.file_url);
      }
      if (report.is_active !== undefined) {
        fields.push("is_active = ?");
        values.push(report.is_active);
      }

      if (fields.length === 0) {
        return await this.findById(id);
      }

      fields.push("updated_at = NOW()");
      values.push(id);

      const query = `UPDATE reports SET ${fields.join(", ")} WHERE id = ?`;
      await pool.execute(query, values);

      return await this.findById(id);
    } catch (error) {
      console.error("Error updating report:", error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const query = "UPDATE reports SET is_active = false, updated_at = NOW() WHERE id = ?";
      const [result] = await pool.execute(query, [id]);

      return (result as any).affectedRows > 0;
    } catch (error) {
      console.error("Error deleting report:", error);
      throw error;
    }
  }
}