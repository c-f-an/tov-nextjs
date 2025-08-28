import { FinancialReport } from '../entities/FinancialReport';

export interface IFinancialReportRepository {
  findAll(): Promise<FinancialReport[]>;
  findById(id: number): Promise<FinancialReport | null>;
  findByYear(year: number): Promise<FinancialReport[]>;
  findByYearMonth(year: number, month: number): Promise<FinancialReport | null>;
  findLatest(): Promise<FinancialReport | null>;
  save(report: FinancialReport): Promise<FinancialReport>;
  delete(id: number): Promise<boolean>;
}