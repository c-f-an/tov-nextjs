"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, FileText, Search } from "lucide-react";
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb";
import ReportCard, { Report } from "@/presentation/components/report/ReportCard";
import SearchBar from "@/presentation/components/news/SearchBar";
import PageHeader from '@/presentation/components/common/PageHeader';

// 임시 데이터 - 더 많은 연도별 데이터
const mockAllBusinessReports: Report[] = [
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
  },
  {
    id: 7,
    title: "2021년 토브협회 사업보고서",
    date: "2021-03-30",
    year: "2021",
    type: "business",
    summary: "2021년도 토브협회의 사업 운영 결과를 담은 보고서입니다. 팬데믹 상황에서도 지속적인 서비스 제공을 위한 노력과 성과를 확인하실 수 있습니다.",
    views: 1654
  },
  {
    id: 8,
    title: "2020년 토브협회 사업보고서",
    date: "2020-04-05",
    year: "2020",
    type: "business",
    summary: "2020년도 토브협회의 사업 활동 보고서입니다. 비대면 서비스 전환과 디지털 혁신을 통한 새로운 도전을 담고 있습니다.",
    views: 1432
  },
  {
    id: 9,
    title: "2019년 토브협회 사업보고서",
    date: "2019-03-28",
    year: "2019",
    type: "business",
    summary: "2019년도 토브협회의 사업 성과 보고서입니다. 교회 세무 교육 확대와 전문 상담 서비스 강화 내용을 포함하고 있습니다.",
    views: 1298
  }
];

export default function BusinessReportListPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("all");

  useEffect(() => {
    // TODO: API에서 데이터 가져오기
    setReports(mockAllBusinessReports);
    setFilteredReports(mockAllBusinessReports);
  }, []);

  useEffect(() => {
    let filtered = reports;

    // 연도 필터
    if (selectedYear !== "all") {
      filtered = filtered.filter(report => report.year === selectedYear);
    }

    // 검색 필터
    if (searchQuery) {
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.summary.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredReports(filtered);
  }, [searchQuery, selectedYear, reports]);

  const years = Array.from(new Set(reports.map(r => r.year))).sort((a, b) => b.localeCompare(a));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <Breadcrumb
            items={[
              { label: "About Us", href: "/about" },
              { label: "사업보고", href: "/about/business" },
              { label: "사업보고서" }
            ]}
            className="text-white/80 mb-4"
          />
          <PageHeader 
            title="사업보고서"
            description="토브협회의 연도별 사업 활동과 성과를 확인하세요"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">전체 연도</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}년</option>
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
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}