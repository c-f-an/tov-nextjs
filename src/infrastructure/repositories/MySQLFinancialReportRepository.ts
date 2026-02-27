import { IFinancialReportRepository } from '@/core/domain/repositories/IFinancialReportRepository';
import { FinancialReport } from '@/core/domain/entities/FinancialReport';
import { query, queryOne } from '../database/mysql';
import { RowDataPacket } from 'mysql2';

interface FinancialReportRow extends RowDataPacket {
  id: number;
  report_year: number;
  report_month: number | null;
  title: string;
  content: string | null;
  total_income: number | null;
  total_expense: number | null;
  balance: number | null;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export class MySQLFinancialReportRepository implements IFinancialReportRepository {
  async findById(id: number): Promise<FinancialReport | null> {
    const row = await queryOne<FinancialReportRow>(
      'SELECT * FROM financial_reports WHERE id = ?',
      [id]
    );
    
    return row ? this.mapToFinancialReport(row) : null;
  }

  async findAll(): Promise<FinancialReport[]> {
    const rows = await query<FinancialReportRow>(
      'SELECT * FROM financial_reports ORDER BY report_year DESC, report_month DESC'
    );
    
    return rows.map(row => this.mapToFinancialReport(row));
  }

  async findByYear(year: number): Promise<FinancialReport[]> {
    const rows = await query<FinancialReportRow>(
      'SELECT * FROM financial_reports WHERE report_year = ? ORDER BY report_month DESC',
      [year]
    );
    
    return rows.map(row => this.mapToFinancialReport(row));
  }

  async findByYearMonth(year: number, month: number): Promise<FinancialReport | null> {
    const row = await queryOne<FinancialReportRow>(
      'SELECT * FROM financial_reports WHERE report_year = ? AND report_month = ?',
      [year, month]
    );
    
    return row ? this.mapToFinancialReport(row) : null;
  }

  async findLatest(): Promise<FinancialReport | null> {
    const row = await queryOne<FinancialReportRow>(
      'SELECT * FROM financial_reports ORDER BY report_year DESC, report_month DESC LIMIT 1'
    );
    
    return row ? this.mapToFinancialReport(row) : null;
  }

  async save(report: FinancialReport): Promise<FinancialReport> {
    const result = await query<any>(
      `INSERT INTO financial_reports (report_year, report_month, title, content, total_income, total_expense, balance, published_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        report.reportYear,
        report.reportMonth,
        report.title,
        report.content,
        report.totalIncome,
        report.totalExpense,
        report.balance,
        report.publishedAt
      ]
    );
    
    return new FinancialReport(
      (result as any).insertId,
      report.reportYear,
      report.reportMonth,
      report.title,
      report.content,
      report.totalIncome,
      report.totalExpense,
      report.balance,
      report.publishedAt,
      new Date(),
      new Date()
    );
  }

  async delete(id: number): Promise<boolean> {
    const result = await query<any>('DELETE FROM financial_reports WHERE id = ?', [id]);
    return (result as any).affectedRows > 0;
  }

  private mapToFinancialReport(row: FinancialReportRow): FinancialReport {
    return new FinancialReport(
      row.id,
      row.report_year,
      row.report_month,
      row.title,
      row.content,
      row.total_income,
      row.total_expense,
      row.balance,
      row.published_at,
      row.created_at,
      row.updated_at
    );
  }
}