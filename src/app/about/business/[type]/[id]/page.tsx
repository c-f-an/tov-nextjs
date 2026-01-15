"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  FileText,
  DollarSign,
  Calendar,
  Eye,
  Download,
  Share2,
  Printer,
} from "lucide-react";
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb";
import { Button } from "@/components/ui/button";

interface ReportDetail {
  id: number;
  title: string;
  date: string;
  year: string;
  type: "business" | "finance";
  summary: string;
  content: string;
  views: number;
  file_url?: string;
}

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/reports/${params.id}`);
        const data = await response.json();

        if (data.success) {
          setReport(data.data);
        } else {
          console.error("Failed to fetch report:", data.error);
          setReport(null);
        }
      } catch (error) {
        console.error("Failed to fetch report:", error);
        setReport(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [params.id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: report?.title,
        text: report?.summary,
        url: window.location.href,
      });
    } else {
      // 클립보드에 복사
      navigator.clipboard.writeText(window.location.href);
      alert("링크가 복사되었습니다.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">보고서를 찾을 수 없습니다.</p>
          <Button onClick={() => router.back()}>돌아가기</Button>
        </div>
      </div>
    );
  }

  const isBusinessReport = params.type === "business";
  const Icon = isBusinessReport ? FileText : DollarSign;
  const themeColor = isBusinessReport ? "blue" : "green";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div
        className={`bg-gradient-to-r ${
          isBusinessReport
            ? "from-blue-600 to-blue-700"
            : "from-green-600 to-green-700"
        } text-white py-16`}
      >
        <div className="container mx-auto px-4">
          <Breadcrumb
            items={[
              { label: "About Us", href: "/about" },
              { label: "사업보고", href: "/about/business" },
              {
                label: isBusinessReport ? "사업보고서" : "재정보고서",
                href: `/about/business/${params.type}-report`,
              },
              { label: report.year + "년" },
            ]}
          />
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`p-3 ${
                isBusinessReport ? "bg-blue-500/20" : "bg-green-500/20"
              } rounded-lg`}
            >
              <Icon className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold">{report.title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-white/90">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{report.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{report.views.toLocaleString()}회 조회</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* 액션 버튼들 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href={`/about/business/${params.type}-report`}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="h-4 w-4" />
              목록으로 돌아가기
            </Link>
            <div className="flex gap-2">
              {report.file_url && (
                <Button variant="outline" size="sm" className="gap-2">
                  <a
                    href={report.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="h-4 w-4" />
                    PDF 다운로드
                  </a>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="gap-2"
              >
                <Share2 className="h-4 w-4" />
                공유
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="gap-2"
              >
                <Printer className="h-4 w-4" />
                인쇄
              </Button>
            </div>
          </div>
        </div>

        {/* 보고서 내용 */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose prose-lg max-w-none">
            {report.summary && (
              <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">요약</h3>
                <p className="text-gray-700">{report.summary}</p>
              </div>
            )}

            {report.content && (
              <div
                className="report-content whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: report.content }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
