"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, FileText, DollarSign, Calendar, Eye, Download, Share2, Printer } from "lucide-react";
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb";
import { Button } from "@/components/ui/button";

interface ReportDetail {
  id: number;
  title: string;
  date: string;
  year: string;
  type: 'business' | 'finance';
  summary: string;
  content: string;
  author: string;
  views: number;
  fileUrl?: string;
}

// 임시 상세 데이터
const mockReportDetail: ReportDetail = {
  id: 1,
  title: "2024년 토브협회 사업보고서",
  date: "2024-03-15",
  year: "2024",
  type: "business",
  summary: "2024년도 토브협회의 주요 사업 성과와 활동 내역을 담은 종합 보고서입니다.",
  author: "토브협회 사무국",
  views: 1234,
  fileUrl: "/reports/2024-business-report.pdf",
  content: `
## 1. 총괄 요약

2024년 토브협회는 '투명한 교회 재정 문화 정착'이라는 비전 아래, 다양한 사업을 추진하여 괄목할 만한 성과를 달성했습니다.

### 주요 성과
- 세무 상담 서비스: 전년 대비 150% 증가
- 교육 프로그램 참여자: 3,500명 (전년 대비 40% 증가)
- 온라인 교육 콘텐츠: 50개 신규 제작
- 자료 다운로드: 25,000건

## 2. 사업별 세부 내용

### 2.1 세무 상담 서비스

#### 종교인 소득세 상담
- 상담 건수: 1,234건
- 주요 상담 내용: 근로소득 vs 기타소득 선택, 종교인소득 과세특례
- 만족도: 4.8/5.0

#### 교회 법인세 상담
- 상담 건수: 567건
- 주요 상담 내용: 수익사업 구분, 고유목적사업준비금
- 만족도: 4.7/5.0

### 2.2 교육 프로그램

#### 정기 교육 프로그램
- 교회 재정 담당자 기초 과정: 12회 운영, 480명 수료
- 교회 세무 실무 심화 과정: 8회 운영, 240명 수료
- 목회자 세무 특강: 15회 운영, 750명 참여

#### 온라인 교육
- 실시간 온라인 강의: 24회 진행
- 녹화 강의 제공: 50개 콘텐츠
- 누적 조회수: 35,000회

### 2.3 자료 제공 서비스

#### 발간 자료
- 「2024 교회 세무 가이드북」 발간 (3,000부)
- 「종교인 소득세 신고 실무」 개정판 발간 (2,000부)
- 월간 뉴스레터 12회 발행

#### 온라인 자료실
- 세무 서식 50종 제공
- 작성 예시 및 해설 자료 30종
- 법령 해석 자료 25종

## 3. 특별 프로그램

### 소규모 교회 지원
- 무료 상담 제공: 234개 교회
- 무료 교육 참여: 156개 교회
- 찾아가는 교육 서비스: 12개 지역

### 신규 교회 지원
- 창립 교회 세무 안내: 45개 교회
- 초기 정착 컨설팅: 23개 교회

## 4. 향후 계획

2025년에는 다음과 같은 사업을 중점적으로 추진할 계획입니다:

1. AI 기반 세무 상담 챗봇 도입
2. 모바일 앱 출시로 접근성 향상
3. 지역별 교육 센터 확대
4. 국제 협력 네트워크 구축

## 5. 감사의 말씀

2024년 한 해 동안 토브협회와 함께해 주신 모든 교회와 목회자, 재정 담당자 여러분께 깊은 감사를 드립니다. 앞으로도 투명하고 건전한 교회 재정 문화를 만들어가는 데 최선을 다하겠습니다.
  `
};

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: API에서 데이터 가져오기
    const fetchReport = async () => {
      setLoading(true);
      try {
        // 임시로 mockData 사용
        setReport(mockReportDetail);
      } catch (error) {
        console.error('Failed to fetch report:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [params.id, params.type]);

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
      alert('링크가 복사되었습니다.');
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
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
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

  const isBusinessReport = params.type === 'business';
  const Icon = isBusinessReport ? FileText : DollarSign;
  const themeColor = isBusinessReport ? 'blue' : 'green';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className={`bg-gradient-to-r ${isBusinessReport ? 'from-blue-600 to-blue-700' : 'from-green-600 to-green-700'} text-white py-16`}>
        <div className="container mx-auto px-4">
          <Breadcrumb
            items={[
              { label: "About Us", href: "/about" },
              { label: "사업보고", href: "/about/business" },
              { label: isBusinessReport ? "사업보고서" : "재정보고서", href: `/about/business/${params.type}-report` },
              { label: report.year + "년" }
            ]}
            className="text-white/80 mb-4"
          />
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 ${isBusinessReport ? 'bg-blue-500/20' : 'bg-green-500/20'} rounded-lg`}>
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
            <span>작성: {report.author}</span>
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
              {report.fileUrl && (
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  PDF 다운로드
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                <Share2 className="h-4 w-4" />
                공유
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
                <Printer className="h-4 w-4" />
                인쇄
              </Button>
            </div>
          </div>
        </div>

        {/* 보고서 내용 */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose prose-lg max-w-none">
            <div className="mb-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">요약</h3>
              <p className="text-gray-700">{report.summary}</p>
            </div>
            
            <div 
              className="report-content"
              dangerouslySetInnerHTML={{ __html: report.content.replace(/\n/g, '<br/>').replace(/##/g, '<h2 class="text-2xl font-bold mt-8 mb-4">').replace(/###/g, '<h3 class="text-xl font-semibold mt-6 mb-3">') }}
            />
          </div>
        </div>

        {/* 관련 보고서 */}
        <div className="mt-12">
          <h3 className="text-xl font-bold mb-6">다른 보고서 보기</h3>
          <div className="flex gap-4">
            <Link
              href={`/about/business/business-report`}
              className={`flex-1 p-4 rounded-lg border-2 hover:shadow-md transition-shadow ${
                isBusinessReport ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <FileText className={`h-6 w-6 mb-2 ${isBusinessReport ? 'text-blue-600' : 'text-gray-600'}`} />
              <h4 className="font-semibold">사업보고서</h4>
              <p className="text-sm text-gray-600 mt-1">토브협회의 사업 활동과 성과</p>
            </Link>
            <Link
              href={`/about/business/finance-report`}
              className={`flex-1 p-4 rounded-lg border-2 hover:shadow-md transition-shadow ${
                !isBusinessReport ? 'border-green-200 bg-green-50' : 'border-gray-200'
              }`}
            >
              <DollarSign className={`h-6 w-6 mb-2 ${!isBusinessReport ? 'text-green-600' : 'text-gray-600'}`} />
              <h4 className="font-semibold">재정보고서</h4>
              <p className="text-sm text-gray-600 mt-1">투명한 재정 운영 현황</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}