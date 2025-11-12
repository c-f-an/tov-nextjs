"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, DollarSign } from "lucide-react";
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb";
import ReportCard, {
  Report,
} from "@/presentation/components/report/ReportCard";
import SearchBar from "@/presentation/components/news/SearchBar";
import PageHeader from "@/presentation/components/common/PageHeader";

// 임시 데이터 - 더 많은 연도별 데이터
const mockAllFinanceReports: Report[] = [];
// [
//   {
//     id: 4,
//     title: "2024년 토브협회 재정보고서",
//     date: "2024-03-15",
//     year: "2024",
//     type: "finance",
//     summary: "2024년도 토브협회의 재정 현황과 예산 집행 내역을 투명하게 공개한 보고서입니다. 수입과 지출 내역, 재무상태표 등을 확인하실 수 있습니다.",
//     views: 987
//   }
// ];

export default function FinanceReportListPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("all");

  useEffect(() => {
    // TODO: API에서 데이터 가져오기
    setReports(mockAllFinanceReports);
    setFilteredReports(mockAllFinanceReports);
  }, []);

  useEffect(() => {
    let filtered = reports;

    // 연도 필터
    if (selectedYear !== "all") {
      filtered = filtered.filter((report) => report.year === selectedYear);
    }

    // 검색 필터
    if (searchQuery) {
      filtered = filtered.filter(
        (report) =>
          report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.summary.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredReports(filtered);
  }, [searchQuery, selectedYear, reports]);

  const years = Array.from(new Set(reports.map((r) => r.year))).sort((a, b) =>
    b.localeCompare(a)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4">
          <Breadcrumb
            items={[
              { label: "About Us", href: "/about" },
              { label: "사업보고", href: "/about/business" },
              { label: "재정보고서" },
            ]}
            className="text-white/80 mb-4"
          />
          <PageHeader
            title="재정보고서"
            description="토브협회의 투명한 재정 운영 현황을 확인하세요"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* 뒤로가기 버튼 */}
        <Link
          href="/about/business"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ChevronLeft className="h-4 w-4" />
          사업보고 메인으로 돌아가기
        </Link>

        {/* 검색 및 필터 영역 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SearchBar
                onSearch={setSearchQuery}
                placeholder="보고서 제목이나 내용을 검색하세요..."
              />
            </div>
            <div className="md:w-48">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">전체 연도</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}년
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 검색 결과 정보 */}
        {(searchQuery || selectedYear !== "all") && (
          <div className="mb-6">
            <p className="text-gray-600">
              {selectedYear !== "all" && `${selectedYear}년 `}
              {searchQuery && `"${searchQuery}" 검색 결과: `}
              {filteredReports.length}건
            </p>
          </div>
        )}

        {/* 보고서 목록 */}
        {filteredReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          </div>
        )}

        {/* 재정 투명성 안내 */}
        <div className="mt-12 bg-green-50 rounded-lg p-8">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">재정 투명성 원칙</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div>
                <h4 className="font-semibold mb-2">정기 감사</h4>
                <p className="text-sm text-gray-600">
                  외부 회계법인의 정기 감사를 통해 재정 건전성을 확인합니다
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">상세 공개</h4>
                <p className="text-sm text-gray-600">
                  모든 수입과 지출 내역을 상세하게 공개합니다
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">정기 보고</h4>
                <p className="text-sm text-gray-600">
                  매년 재정보고서를 발간하여 투명하게 공개합니다
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
