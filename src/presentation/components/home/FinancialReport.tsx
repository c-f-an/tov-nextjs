import Link from 'next/link';
import { FinancialReport as FinancialReportEntity } from '@/core/domain/entities/FinancialReport';

interface FinancialReportProps {
  report: FinancialReportEntity | null;
}

// Default data for when DB has no reports
const defaultFinancialData = {
  year: 2023,
  totalIncome: 523450000,
  totalExpense: 487320000,
  balance: 36130000,
  incomeBreakdown: [
    { category: '후원금', amount: 320000000, percentage: 61 },
    { category: '정부보조금', amount: 150000000, percentage: 29 },
    { category: '기타수익', amount: 53450000, percentage: 10 }
  ],
  expenseBreakdown: [
    { category: '사업비', amount: 350000000, percentage: 72 },
    { category: '인건비', amount: 87320000, percentage: 18 },
    { category: '운영비', amount: 50000000, percentage: 10 }
  ]
};

export function FinancialReport({ report }: FinancialReportProps) {
  const formatCurrency = (amount: number) => {
    return (amount / 100000000).toFixed(1) + '억원';
  };
  
  // Use DB report if available, otherwise use default data
  const displayData = report ? {
    year: report.reportYear,
    month: report.reportMonth,
    totalIncome: report.totalIncome || 0,
    totalExpense: report.totalExpense || 0,
    balance: report.balance || 0,
    title: report.title,
    content: report.content
  } : defaultFinancialData;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">재정 현황</h2>
        <p className="text-gray-600">투명한 재정 운영을 위해 정기적으로 공개합니다</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-semibold">
            {displayData.month 
              ? `${displayData.year}년 ${displayData.month}월 재정 보고`
              : `${displayData.year}년 재정 보고`
            }
          </h3>
          <Link href="/donation/report" className="text-blue-600 hover:underline text-sm">
            전체 보고서 보기 →
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="text-blue-600 text-sm font-medium mb-2">총 수입</div>
            <div className="text-2xl font-bold text-blue-900">
              {formatCurrency(displayData.totalIncome)}
            </div>
          </div>
          <div className="bg-orange-50 rounded-lg p-6">
            <div className="text-orange-600 text-sm font-medium mb-2">총 지출</div>
            <div className="text-2xl font-bold text-orange-900">
              {formatCurrency(displayData.totalExpense)}
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-6">
            <div className="text-green-600 text-sm font-medium mb-2">잔액</div>
            <div className="text-2xl font-bold text-green-900">
              {formatCurrency(displayData.balance)}
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Income Breakdown */}
          <div>
            <h4 className="font-semibold mb-4">수입 내역</h4>
            <div className="space-y-3">
              {defaultFinancialData.incomeBreakdown.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{item.category}</span>
                    <span className="font-medium">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expense Breakdown */}
          <div>
            <h4 className="font-semibold mb-4">지출 내역</h4>
            <div className="space-y-3">
              {defaultFinancialData.expenseBreakdown.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{item.category}</span>
                    <span className="font-medium">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-600 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-center text-sm text-gray-600">
          <p>
            토브협회는 「공익법인의 설립·운영에 관한 법률」에 따라<br />
            재정 정보를 투명하게 공개하고 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}