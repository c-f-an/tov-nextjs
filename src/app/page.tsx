import { MainBanner } from '@/presentation/components/home/MainBanner';
import { QuickLinks } from '@/presentation/components/home/QuickLinks';
import { LatestNews } from '@/presentation/components/home/LatestNews';
import { ConsultationBanner } from '@/presentation/components/home/ConsultationBanner';
import { FinancialReport } from '@/presentation/components/home/FinancialReport';

export default function Home() {
  return (
    <>
      {/* Main Banner */}
      <MainBanner />
      
      {/* Quick Links */}
      <QuickLinks />
      
      {/* Latest News & Notice */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <LatestNews />
        </div>
      </section>
      
      {/* Consultation Banner */}
      <ConsultationBanner />
      
      {/* Financial Report */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <FinancialReport />
        </div>
      </section>
    </>
  );
}
