"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, FileText, Search } from "lucide-react";
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb";
import ReportCard, {
  Report,
} from "@/presentation/components/report/ReportCard";
import SearchBar from "@/presentation/components/news/SearchBar";
import PageHeader from "@/presentation/components/common/PageHeader";


export default function BusinessReportListPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/reports?type=business");
        const data = await response.json();

        if (data.success) {
          setReports(data.data);
          setFilteredReports(data.data);
        } else {
          console.error("Failed to fetch business reports:", data.error);
        }
      } catch (error) {
        console.error("Error fetching business reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
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
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <Breadcrumb
            items={[
              { label: "About Us", href: "/about" },
              { label: "사업보고", href: "/about/business" },
              { label: "사업보고서" },
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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">보고서를 불러오는 중...</p>
            </div>
          </div>
        ) : filteredReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchQuery || selectedYear !== "all"
                ? "검색 결과가 없습니다."
                : "등록된 사업보고서가 없습니다."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
