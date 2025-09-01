import type { IConsultationRepository } from '@/core/domain/repositories/IConsultationRepository';
import type { Result } from '@/shared/types/Result';
import { Ok, Err } from '@/shared/types/Result';
export interface ConsultationStats {
  totalConsultations: number;
  completedConsultations: number;
  averageSatisfaction: number;
  thisMonthConsultations: number;
}
export class GetConsultationStatsUseCase {
  constructor(
    private consultationRepository: IConsultationRepository
  ) {}
  async execute(): Promise<Result<ConsultationStats>> {
    try {
      // Get all consultations for stats - fetch a large number
      const result = await this.consultationRepository.findAll(
        {},
        { page: 1, limit: 10000 }
      );
      const allConsultations = result.data;
      // Calculate total consultations
      const totalConsultations = allConsultations.length;
      // Calculate completed consultations
      const completedConsultations = allConsultations.filter(
        c => c.status === 'completed'
      ).length;
      // Calculate this month's consultations
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const thisMonthConsultations = allConsultations.filter(
        c => c.createdAt && c.createdAt >= firstDayOfMonth
      ).length;
      // For now, we'll use a placeholder for satisfaction
      // In a real implementation, this would come from a satisfaction survey table
      const averageSatisfaction = 95;
      const stats: ConsultationStats = {
        totalConsultations,
        completedConsultations,
        averageSatisfaction,
        thisMonthConsultations
      };
      return Ok(stats);
    } catch (error) {
      console.error('Error in GetConsultationStatsUseCase:', error);
      return Err(new Error('Failed to get consultation statistics'));
    }
  }
}