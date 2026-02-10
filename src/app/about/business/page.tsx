"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, FileText, AlertCircle } from "lucide-react";
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb";
import ReportCard, {
  Report,
} from "@/presentation/components/report/ReportCard";
import PageHeader from "@/presentation/components/common/PageHeader";

export default function BusinessPage() {
  const [businessReports, setBusinessReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch business reports
        const businessRes = await fetch("/api/reports?type=business");
        const businessData = await businessRes.json();

        if (businessData.success) {
          setBusinessReports(businessData.data.slice(0, 3)); // Show latest 3
        } else {
          console.error(
            "Failed to fetch business reports:",
            businessData.error
          );
        }
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("보고서를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title={<></>}
          description=""
          backgroundImage="/menu-header/header-bg-about-business.webp"
          overlayColor="#00357f"
          overlayOpacity={0}
        >
          <Breadcrumb
            items={[{ label: "About Us" }, { label: "사업보고" }]}
            variant="light"
          />
        </PageHeader>

        {/* 사업보고 섹션 */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">사업보고</h2>
                <p className="text-gray-600">
                  토브협회의 사업 활동과 성과를 확인하세요
                </p>
              </div>
            </div>
            <Link
              href="/about/business/business-report"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
            >
              더보기 <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">보고서를 불러오는 중...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          ) : businessReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {businessReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                등록된 사업보고서가 없습니다.
              </p>
              <p className="text-sm text-gray-500">
                새로운 보고서가 등록되면 이곳에 표시됩니다.
              </p>
            </div>
          )}
        </section>

        {/* 하단 정보 섹션 */}
        {/* <div className="mt-16 bg-gray-100 rounded-lg p-8">
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
        </div> */}
      </div>
    </main>
  );
}
