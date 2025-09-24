"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Building2,
  Target,
  CheckCircle,
  Eye,
  Filter,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
}

const organizationTypes: Record<string, string> = {
  all: "전체",
  church: "교회",
  nonprofit: "비영리단체",
  foundation: "재단",
};

const consultingTypes: Record<string, string> = {
  all: "전체",
  system_setup: "시스템 구축",
  diagnosis: "진단/평가",
  training: "교육/훈련",
};

export default function FinancialConsultingCasesPage() {
  const [cases, setCases] = useState<ConsultingCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrgType, setSelectedOrgType] = useState("all");
  const [selectedConsultType, setSelectedConsultType] = useState("all");

  useEffect(() => {
    fetchCases();
  }, [selectedOrgType, selectedConsultType]);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedOrgType !== "all") {
        params.append("organizationType", selectedOrgType);
      }
      if (selectedConsultType !== "all") {
        params.append("consultingType", selectedConsultType);
      }

      const response = await fetch(`/api/financial-consulting-cases?${params}`);
      const data = await response.json();

      if (data.success) {
        setCases(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch cases:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "system_setup":
        return "bg-blue-100 text-blue-700";
      case "diagnosis":
        return "bg-green-100 text-green-700";
      case "training":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getOrgTypeColor = (type: string) => {
    switch (type) {
      case "church":
        return "bg-indigo-100 text-indigo-700";
      case "nonprofit":
        return "bg-orange-100 text-orange-700";
      case "foundation":
        return "bg-pink-100 text-pink-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <Breadcrumb
            items={[
              { label: "건강한 재정관리", href: "/movement/financial-management" },
              { label: "컨설팅 사례" },
            ]}
          />
        </div>

        <PageHeader
          title="재정관리 컨설팅 사례"
          description="토브협회가 진행한 재정관리 컨설팅 사례들을 확인해보세요"
        />

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">필터</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                기관 유형
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(organizationTypes).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedOrgType(key)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedOrgType === key
                        ? "bg-primary text-black"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                컨설팅 유형
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(consultingTypes).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedConsultType(key)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedConsultType === key
                        ? "bg-primary text-black"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Cases Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">사례를 불러오는 중...</div>
          </div>
        ) : cases.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">해당하는 컨설팅 사례가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.map((consultCase) => (
              <Card
                key={consultCase.id}
                className="hover:shadow-xl transition-shadow duration-300 overflow-hidden group cursor-pointer"
                onClick={() => window.location.href = `/financial-consulting-cases/${consultCase.id}`}
              >
                {consultCase.thumbnail_image && (
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={consultCase.thumbnail_image}
                      alt={consultCase.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <CardContent className="p-6">
                  {consultCase.is_featured && (
                    <div className="mb-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                        <CheckCircle className="w-3 h-3" />
                        대표 사례
                      </span>
                    </div>
                  )}

                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {consultCase.title}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building2 className="w-4 h-4" />
                      <span>{consultCase.organization_name}</span>
                    </div>

                    <div className="flex gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getOrgTypeColor(consultCase.organization_type)}`}>
                        {organizationTypes[consultCase.organization_type]}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getTypeColor(consultCase.consulting_type)}`}>
                        {consultingTypes[consultCase.consulting_type]}
                      </span>
                    </div>

                    {consultCase.consulting_period && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>컨설팅 기간: {consultCase.consulting_period}</span>
                      </div>
                    )}
                  </div>

                  {consultCase.result && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        <span className="font-medium">주요 성과: </span>
                        {consultCase.result}
                      </p>
                    </div>
                  )}

                  {consultCase.client_feedback && (
                    <div className="p-3 bg-gray-50 rounded-lg mb-4">
                      <p className="text-sm text-gray-700 italic line-clamp-2">
                        "{consultCase.client_feedback}"
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Eye className="w-4 h-4" />
                      <span>{consultCase.view_count}회</span>
                    </div>

                    <button className="flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all">
                      자세히 보기
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              재정관리 컨설팅이 필요하신가요?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              토브협회의 전문 컨설턴트가 귀 기관의 재정관리 체계를 진단하고
              맞춤형 솔루션을 제공해드립니다.
            </p>
            <Link
              href="/consultation/apply"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-black font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <Target className="w-5 h-5" />
              컨설팅 문의하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}