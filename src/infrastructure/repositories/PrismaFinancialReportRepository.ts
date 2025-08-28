import { injectable } from 'tsyringe';
import { IFinancialReportRepository } from '@/core/domain/repositories/IFinancialReportRepository';
import { FinancialReport } from '@/core/domain/entities/FinancialReport';
import { prisma } from '../database/prisma';

@injectable()
export class PrismaFinancialReportRepository implements IFinancialReportRepository {
  async findAll(): Promise<FinancialReport[]> {
    const reports = await prisma.financialReport.findMany({
      orderBy: [
        { reportYear: 'desc' },
        { reportMonth: 'desc' }
      ]
    });

    return reports.map(report => new FinancialReport(
      report.id,
      report.reportYear,
      report.reportMonth,
      report.title,
      report.content,
      report.totalIncome ? Number(report.totalIncome) : null,
      report.totalExpense ? Number(report.totalExpense) : null,
      report.balance ? Number(report.balance) : null,
      report.publishedAt,
      report.createdAt,
      report.updatedAt
    ));
  }

  async findById(id: number): Promise<FinancialReport | null> {
    const report = await prisma.financialReport.findUnique({
      where: { id }
    });

    if (!report) return null;

    return new FinancialReport(
      report.id,
      report.reportYear,
      report.reportMonth,
      report.title,
      report.content,
      report.totalIncome ? Number(report.totalIncome) : null,
      report.totalExpense ? Number(report.totalExpense) : null,
      report.balance ? Number(report.balance) : null,
      report.publishedAt,
      report.createdAt,
      report.updatedAt
    );
  }

  async findByYear(year: number): Promise<FinancialReport[]> {
    const reports = await prisma.financialReport.findMany({
      where: { reportYear: year },
      orderBy: { reportMonth: 'desc' }
    });

    return reports.map(report => new FinancialReport(
      report.id,
      report.reportYear,
      report.reportMonth,
      report.title,
      report.content,
      report.totalIncome ? Number(report.totalIncome) : null,
      report.totalExpense ? Number(report.totalExpense) : null,
      report.balance ? Number(report.balance) : null,
      report.publishedAt,
      report.createdAt,
      report.updatedAt
    ));
  }

  async findByYearMonth(year: number, month: number): Promise<FinancialReport | null> {
    const report = await prisma.financialReport.findFirst({
      where: { 
        reportYear: year,
        reportMonth: month
      }
    });

    if (!report) return null;

    return new FinancialReport(
      report.id,
      report.reportYear,
      report.reportMonth,
      report.title,
      report.content,
      report.totalIncome ? Number(report.totalIncome) : null,
      report.totalExpense ? Number(report.totalExpense) : null,
      report.balance ? Number(report.balance) : null,
      report.publishedAt,
      report.createdAt,
      report.updatedAt
    );
  }

  async findLatest(): Promise<FinancialReport | null> {
    const report = await prisma.financialReport.findFirst({
      where: {
        publishedAt: {
          not: null
        }
      },
      orderBy: [
        { reportYear: 'desc' },
        { reportMonth: 'desc' }
      ]
    });

    if (!report) return null;

    return new FinancialReport(
      report.id,
      report.reportYear,
      report.reportMonth,
      report.title,
      report.content,
      report.totalIncome ? Number(report.totalIncome) : null,
      report.totalExpense ? Number(report.totalExpense) : null,
      report.balance ? Number(report.balance) : null,
      report.publishedAt,
      report.createdAt,
      report.updatedAt
    );
  }

  async save(financialReport: FinancialReport): Promise<FinancialReport> {
    const data = {
      reportYear: financialReport.reportYear,
      reportMonth: financialReport.reportMonth,
      title: financialReport.title,
      content: financialReport.content,
      totalIncome: financialReport.totalIncome,
      totalExpense: financialReport.totalExpense,
      balance: financialReport.balance,
      publishedAt: financialReport.publishedAt
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
      savedReport.reportYear,
      savedReport.reportMonth,
      savedReport.title,
      savedReport.content,
      savedReport.totalIncome ? Number(savedReport.totalIncome) : null,
      savedReport.totalExpense ? Number(savedReport.totalExpense) : null,
      savedReport.balance ? Number(savedReport.balance) : null,
      savedReport.publishedAt,
      savedReport.createdAt,
      savedReport.updatedAt
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