"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Building2,
  Target,
  Lightbulb,
  CheckCircle2,
  MessageSquareQuote,
  Eye,
  Tag,
  Share2,
  Printer,
} from "lucide-react";
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb";
import PageHeader from "@/presentation/components/common/PageHeader";

interface ConsultingCase {
  id: number;
  title: string;
  organization_name: string;
  organization_type: string;
  consulting_type: string;
  consulting_period?: string;
  thumbnail_image?: string;
  challenge?: string;
  solution?: string;
  result?: string;
  client_feedback?: string;
  tags?: string;
  is_featured: boolean;
  view_count: number;
  consulting_date?: string;
  created_at: string;
  updated_at: string;
}

const organizationTypes: Record<string, string> = {
  church: "교회",
  nonprofit: "비영리단체",
  foundation: "재단",
};

const consultingTypes: Record<string, string> = {
  system_setup: "시스템 구축",
  diagnosis: "진단/평가",
  training: "교육/훈련",
};

export default function FinancialConsultingCaseDetailPage() {
  const params = useParams();
  const [caseData, setCaseData] = useState<ConsultingCase | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchCaseDetail();
    }
  }, [params.id]);

  const fetchCaseDetail = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/financial-consulting-cases/${params.id}`);
      const data = await response.json();

      if (data.success) {
        setCaseData(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch case detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: caseData?.title,
        text: `토브협회 재정관리 컨설팅 사례: ${caseData?.title}`,
        url: window.location.href,
      });
    } else {
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
        <div className="text-gray-500">사례를 불러오는 중...</div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">사례를 찾을 수 없습니다.</p>
        <Link
          href="/financial-consulting-cases"
          className="text-primary hover:underline"
        >
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <Breadcrumb
            items={[
              { label: "건강한 재정관리", href: "/movement/financial-management" },
              { label: "컨설팅 사례", href: "/financial-consulting-cases" },
              { label: caseData.title },
            ]}
          />
        </div>

        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          {caseData.is_featured && (
            <div className="mb-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full">
                <CheckCircle2 className="w-4 h-4" />
                대표 사례
              </span>
            </div>
          )}

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {caseData.title}
          </h1>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span>{caseData.organization_name}</span>
            </div>
            {caseData.consulting_date && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(caseData.consulting_date)}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>조회 {caseData.view_count}회</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full">
              {organizationTypes[caseData.organization_type]}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
              {consultingTypes[caseData.consulting_type]}
            </span>
            {caseData.consulting_period && (
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                컨설팅 기간: {caseData.consulting_period}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-6 border-t">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              공유하기
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Printer className="w-4 h-4" />
              인쇄하기
            </button>
          </div>
        </div>

        {/* Thumbnail Image */}
        {caseData.thumbnail_image && (
          <div className="mb-8">
            <img
              src={caseData.thumbnail_image}
              alt={caseData.title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Content Sections */}
        <div className="space-y-8">
          {caseData.challenge && (
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">도전 과제</h2>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {caseData.challenge}
              </p>
            </div>
          )}

          {caseData.solution && (
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">해결 방안</h2>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {caseData.solution}
              </p>
            </div>
          )}

          {caseData.result && (
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">컨설팅 결과</h2>
              </div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {caseData.result}
              </p>
            </div>
          )}

          {caseData.client_feedback && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <MessageSquareQuote className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">고객 후기</h2>
              </div>
              <blockquote className="text-lg text-gray-700 italic leading-relaxed">
                "{caseData.client_feedback}"
              </blockquote>
            </div>
          )}

          {caseData.tags && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">관련 태그</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {caseData.tags.split(",").map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            이런 컨설팅이 필요하신가요?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            토브협회의 전문 컨설턴트가 귀 기관의 재정관리 체계를 진단하고
            맞춤형 솔루션을 제공해드립니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/consultation/apply"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-black font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
            >
              컨설팅 문의하기
            </Link>
            <Link
              href="/financial-consulting-cases"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              다른 사례 보기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}