import { inject, injectable } from 'tsyringe';
import { IConsultationRepository } from '@/core/domain/repositories/IConsultationRepository';
import { Result } from '@/shared/types/Result';

export interface ConsultationStats {
  totalConsultations: number;
  completedConsultations: number;
  averageSatisfaction: number;
  thisMonthConsultations: number;
}

@injectable()
export class GetConsultationStatsUseCase {
  constructor(
    @inject('IConsultationRepository')
    private consultationRepository: IConsultationRepository
  ) {}

  async execute(): Promise<Result<ConsultationStats>> {
    try {
      // Get all consultations for stats
      const allConsultations = await this.consultationRepository.findAll();
      
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

      return Result.ok(stats);
    } catch (error) {
      console.error('Error in GetConsultationStatsUseCase:', error);
      return Result.fail('Failed to get consultation statistics');
    }
  }
}