import { inject, injectable } from 'tsyringe';
import type { IFinancialReportRepository } from '@/core/domain/repositories/IFinancialReportRepository';
import type { Result } from '@/shared/types/Result';
import { Ok, Err } from '@/shared/types/Result';
import { FinancialReport } from '@/core/domain/entities/FinancialReport';

@injectable()
export class GetLatestFinancialReportUseCase {
  constructor(
    @inject('IFinancialReportRepository')
    private financialReportRepository: IFinancialReportRepository
  ) {}

  async execute(): Promise<Result<FinancialReport | null>> {
    try {
      // Get the latest published financial report
      const latestReport = await this.financialReportRepository.findLatest();
      
      return Ok(latestReport);
    } catch (error) {
      console.error('Error in GetLatestFinancialReportUseCase:', error);
      return Err(new Error('Failed to get latest financial report'));
    }
  }
}