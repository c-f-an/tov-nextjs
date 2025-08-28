import Link from 'next/link';
import { ConsultationStats } from '@/core/application/use-cases/consultation/GetConsultationStatsUseCase';

interface ConsultationBannerProps {
  stats: ConsultationStats | null;
}

export function ConsultationBanner({ stats }: ConsultationBannerProps) {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            전문가와 함께하는 맞춤형 상담
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            종교인 소득세, 비영리 회계, 결산 공시 등<br />
            각 분야 전문가가 직접 상담해 드립니다.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <div className="text-4xl font-bold mb-2">
                {stats ? stats.totalConsultations.toLocaleString() : '1,000'}+
              </div>
              <div className="text-blue-100">전체 상담 건수</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <div className="text-4xl font-bold mb-2">
                {stats ? stats.completedConsultations.toLocaleString() : '950'}+
              </div>
              <div className="text-blue-100">완료된 상담</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <div className="text-4xl font-bold mb-2">
                {stats ? stats.averageSatisfaction : '95'}%
              </div>
              <div className="text-blue-100">평균 만족도</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/consultation/apply"
              className="inline-block bg-white text-blue-600 font-semibold py-3 px-8 rounded-md hover:bg-gray-100 transition-colors"
            >
              상담 신청하기
            </Link>
            <Link
              href="/consultation/guide"
              className="inline-block bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-md hover:bg-white/10 transition-colors"
            >
              상담 안내 보기
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}