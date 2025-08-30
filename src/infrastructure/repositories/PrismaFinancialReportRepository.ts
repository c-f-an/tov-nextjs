import { injectable } from 'tsyringe';
import { IFinancialReportRepository } from '@/core/domain/repositories/IFinancialReportRepository';
import { FinancialReport } from '@/core/domain/entities/FinancialReport';
import { prisma } from '../database/prisma';

@injectable()
export class PrismaFinancialReportRepository implements IFinancialReportRepository {
  async findAll(): Promise<FinancialReport[]> {
    const reports = await prisma.financialReport.findMany({
      orderBy: [
        { report_year: 'desc' },
        { report_month: 'desc' }
      ]
    });

    return reports.map(report => new FinancialReport(
      report.id,
      report.report_year,
      report.report_month,
      report.title,
      report.content,
      report.total_income ? Number(report.total_income) : null,
      report.total_expense ? Number(report.total_expense) : null,
      report.balance ? Number(report.balance) : null,
      report.published_at,
      report.created_at,
      report.updated_at
    ));
  }

  async findById(id: number): Promise<FinancialReport | null> {
    const report = await prisma.financialReport.findUnique({
      where: { id }
    });

    if (!report) return null;

    return new FinancialReport(
      report.id,
      report.report_year,
      report.report_month,
      report.title,
      report.content,
      report.total_income ? Number(report.total_income) : null,
      report.total_expense ? Number(report.total_expense) : null,
      report.balance ? Number(report.balance) : null,
      report.published_at,
      report.created_at,
      report.updated_at
    );
  }

  async findByYear(year: number): Promise<FinancialReport[]> {
    const reports = await prisma.financialReport.findMany({
      where: { report_year: year },
      orderBy: { report_month: 'desc' }
    });

    return reports.map(report => new FinancialReport(
      report.id,
      report.report_year,
      report.report_month,
      report.title,
      report.content,
      report.total_income ? Number(report.total_income) : null,
      report.total_expense ? Number(report.total_expense) : null,
      report.balance ? Number(report.balance) : null,
      report.published_at,
      report.created_at,
      report.updated_at
    ));
  }

  async findByYearMonth(year: number, month: number): Promise<FinancialReport | null> {
    const report = await prisma.financialReport.findFirst({
      where: { 
        report_year: year,
        report_month: month
      }
    });

    if (!report) return null;

    return new FinancialReport(
      report.id,
      report.report_year,
      report.report_month,
      report.title,
      report.content,
      report.total_income ? Number(report.total_income) : null,
      report.total_expense ? Number(report.total_expense) : null,
      report.balance ? Number(report.balance) : null,
      report.published_at,
      report.created_at,
      report.updated_at
    );
  }

  async findLatest(): Promise<FinancialReport | null> {
    const report = await prisma.financialReport.findFirst({
      where: {
        published_at: {
          not: null
        }
      },
      orderBy: [
        { report_year: 'desc' },
        { report_month: 'desc' }
      ]
    });

    if (!report) return null;

    return new FinancialReport(
      report.id,
      report.report_year,
      report.report_month,
      report.title,
      report.content,
      report.total_income ? Number(report.total_income) : null,
      report.total_expense ? Number(report.total_expense) : null,
      report.balance ? Number(report.balance) : null,
      report.published_at,
      report.created_at,
      report.updated_at
    );
  }

  async save(financialReport: FinancialReport): Promise<FinancialReport> {
    const data = {
      report_year: financialReport.report_year,
      report_month: financialReport.report_month,
      title: financialReport.title,
      content: financialReport.content,
      total_income: financialReport.total_income,
      total_expense: financialReport.total_expense,
      balance: financialReport.balance,
      published_at: financialReport.published_at
    };

    const savedReport = financialReport.id
      ? await prisma.financialReport.update({
          where: { id: financialReport.id },
          data
        })
      : await prisma.financialReport.create({
          data
        });

    return new FinancialReport(
      savedReport.id,
      savedReport.report_year,
      savedReport.report_month,
      savedReport.title,
      savedReport.content,
      savedReport.total_income ? Number(savedReport.total_income) : null,
      savedReport.total_expense ? Number(savedReport.total_expense) : null,
      savedReport.balance ? Number(savedReport.balance) : null,
      savedReport.published_at,
      savedReport.created_at,
      savedReport.updated_at
    );
  }

  async delete(id: number): Promise<boolean> {
    try {
      await prisma.financialReport.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}