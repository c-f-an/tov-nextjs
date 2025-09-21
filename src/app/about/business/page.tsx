"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, FileText, DollarSign } from "lucide-react";
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb";
import ReportCard, { Report } from "@/presentation/components/report/ReportCard";
import PageHeader from '@/presentation/components/common/PageHeader';

// 임시 데이터 - 나중에 API로 대체
const mockBusinessReports: Report[] = [
  {
    id: 1,
    title: "2024년 토브협회 사업보고서",
    date: "2024-03-15",
    year: "2024",
    type: "business",
    summary: "2024년도 토브협회의 주요 사업 성과와 활동 내역을 담은 종합 보고서입니다. 세무 상담, 교육 프로그램, 자료 제공 서비스 등의 성과를 확인하실 수 있습니다.",
    views: 1234
  },
  {
    id: 2,
    title: "2023년 토브협회 사업보고서",
    date: "2023-03-20",
    year: "2023",
    type: "business",
    summary: "2023년도 토브협회의 사업 활동과 성과를 정리한 보고서입니다. 전년 대비 성장한 서비스 분야와 신규 프로그램에 대한 상세한 내용을 포함하고 있습니다.",
    views: 2341
  },
  {
    id: 3,
    title: "2022년 토브협회 사업보고서",
    date: "2022-03-25",
    year: "2022",
    type: "business",
    summary: "2022년도 토브협회의 사업 실적과 주요 활동을 담은 보고서입니다. 코로나19 상황에서의 비대면 서비스 확대와 온라인 교육 프로그램 성과를 확인하실 수 있습니다.",
    views: 1876
  }
];

const mockFinanceReports: Report[] = [
  {
    id: 4,
    title: "2024년 토브협회 재정보고서",
    date: "2024-03-15",
    year: "2024",
    type: "finance",
    summary: "2024년도 토브협회의 재정 현황과 예산 집행 내역을 투명하게 공개한 보고서입니다. 수입과 지출 내역, 재무상태표 등을 확인하실 수 있습니다.",
    views: 987
  },
  {
    id: 5,
    title: "2023년 토브협회 재정보고서",
    date: "2023-03-20",
    year: "2023",
    type: "finance",
    summary: "2023년도 토브협회의 재정 운영 결과를 정리한 보고서입니다. 전년 대비 재정 변화와 주요 사업별 예산 집행 현황을 상세히 담고 있습니다.",
    views: 1543
  },
  {
    id: 6,
    title: "2022년 토브협회 재정보고서",
    date: "2022-03-25",
    year: "2022",
    type: "finance",
    summary: "2022년도 토브협회의 재정 상태와 예산 운영 실적을 담은 보고서입니다. 효율적인 재정 운영을 위한 노력과 그 결과를 확인하실 수 있습니다.",
    views: 1234
  }
];

export default function BusinessPage() {
  const [businessReports, setBusinessReports] = useState<Report[]>([]);
  const [financeReports, setFinanceReports] = useState<Report[]>([]);

  useEffect(() => {
    // TODO: API에서 데이터 가져오기
    setBusinessReports(mockBusinessReports);
    setFinanceReports(mockFinanceReports);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[{ label: "About Us", href: "/about" }, { label: "사업보고" }]}
        />
        <PageHeader 
          title="사업보고"
          description="투명함의 약속 | Tov의 사명을 실현하는 이야기입니다."
        />

        {/* 사업보고 섹션 */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">사업보고</h2>
                <p className="text-gray-600">토브협회의 사업 활동과 성과를 확인하세요</p>
              </div>
            </div>
            <Link
              href="/about/business/business-report"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
            >
              더보기 <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {businessReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </section>

        {/* 재정보고 섹션 */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">재정보고</h2>
                <p className="text-gray-600">투명한 재정 운영 현황을 공개합니다</p>
              </div>
            </div>
            <Link
              href="/about/business/finance-report"
              className="flex items-center gap-1 text-green-600 hover:text-green-700 font-medium"
            >
              더보기 <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {financeReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </section>

        {/* 하단 정보 섹션 */}
        <div className="mt-16 bg-gray-100 rounded-lg p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">투명한 운영의 약속</h3>
            <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
              토브협회는 모든 사업과 재정 운영을 투명하게 공개합니다. 
              정기적인 보고서 발간을 통해 회원 여러분과 소통하며, 
              더 나은 서비스를 제공하기 위해 노력하겠습니다.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-lg p-6">
                <h4 className="font-bold mb-2">정기 보고</h4>
                <p className="text-sm text-gray-600">
                  매년 정기적으로 사업 및 재정 보고서를 발간합니다
                </p>
              </div>
              <div className="bg-white rounded-lg p-6">
                <h4 className="font-bold mb-2">상세 공개</h4>
                <p className="text-sm text-gray-600">
                  모든 활동과 재정 내역을 상세하게 공개합니다
                </p>
              </div>
              <div className="bg-white rounded-lg p-6">
                <h4 className="font-bold mb-2">열린 소통</h4>
                <p className="text-sm text-gray-600">
                  회원 여러분의 의견을 적극적으로 수렴합니다
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}