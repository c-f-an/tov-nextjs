"use client";

import { useState, useEffect } from "react";
import { DollarSign, Search } from "lucide-react";
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb";
import ReportCard, {
  Report,
} from "@/presentation/components/report/ReportCard";
import { Input } from "@/components/ui/input";
import PageHeader from "@/presentation/components/common/PageHeader";


export default function FinanceReportListPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/reports?type=finance");
        const data = await response.json();

        if (data.success) {
          setReports(data.data);
          setFilteredReports(data.data);
        } else {
          console.error("Failed to fetch finance reports:", data.error);
        }
      } catch (error) {
        console.error("Error fetching finance reports:", error);
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
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (report) =>
          report.title.toLowerCase().includes(query) ||
          (report.summary?.toLowerCase().includes(query) ?? false)
      );
    }

    setFilteredReports(filtered);
  }, [searchQuery, selectedYear, reports]);

  const years = Array.from(new Set(reports.map((r) => r.year))).sort((a, b) =>
    b.localeCompare(a)
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title={<></>}
          description=""
          backgroundImage="/menu-header/header-bg-donation-report.webp"
          overlayOpacity={0.6}
        >
          <Breadcrumb
            items={[{ label: "후원하기" }, { label: "재정보고", href: "/donation/report" }, { label: "재정보고서" },
            ]}
            variant="light"
          />
        </PageHeader>

        {/* 검색 및 필터 영역 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-8">
          <div className="flex flex-col md:flex-row gap-3 items-stretch">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="보고서 제목이나 내용을 검색하세요..."
                className="pl-10 h-10 w-full"
              />
            </div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="h-10 px-4 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all md:w-40"
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

        {/* 검색 결과 정보 */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            {searchQuery || selectedYear !== "all" ? (
              <>
                {selectedYear !== "all" && (
                  <span className="font-medium text-gray-700">{selectedYear}년</span>
                )}
                {selectedYear !== "all" && searchQuery && " · "}
                {searchQuery && (
                  <>
                    <span className="text-blue-600">&ldquo;{searchQuery}&rdquo;</span> 검색 결과
                  </>
                )}
                {" · "}
                <span className="font-semibold text-gray-700">{filteredReports.length}건</span>
              </>
            ) : (
              <>
                전체 <span className="font-semibold text-gray-700">{reports.length}건</span>
              </>
            )}
          </p>
        </div>

        {/* 보고서 목록 */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500 text-sm">보고서를 불러오는 중...</p>
            </div>
          </div>
        ) : filteredReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <DollarSign className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-center">
              {searchQuery || selectedYear !== "all"
                ? "검색 결과가 없습니다."
                : "등록된 재정보고서가 없습니다."}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
