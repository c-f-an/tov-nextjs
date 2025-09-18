"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Scale,
  Target,
  CheckCircle2,
  Users,
  RefreshCcw,
  Activity,
  ClipboardList,
  Calculator,
  FileBarChart,
  Eye,
  Users2,
  FileText,
  Phone,
  FileSearch,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb";

export default function HealthyFinancialManagementPage() {
  const rules = [
    {
      icon: Eye,
      title: "투명성 (Transparency)",
      description:
        "투명성은 단순 공개가 아니라 &apos;소통 방식&apos;을 의미합니다.",
      color: "blue",
    },
    {
      icon: Scale,
      title: "적법성 (Legality)",
      description: "국가 규정에 맞추는 것은 사회적 신뢰 확보와 연결 됩니다.",
      color: "green",
    },
    {
      icon: Target,
      title: "적합성 (Appropriateness)",
      description: "비전과 미션 중심성으로 재정을 사용해야 합니다.",
      color: "purple",
    },
    {
      icon: CheckCircle2,
      title: "적절성 (Propriety)",
      description: "재정의 규모와 환경에 따른 합리적 분배가 필요합니다.",
      color: "orange",
    },
    {
      icon: Shield,
      title: "책임성 (Accountability)",
      description: "다중 견제와 제도적 책임 구조를 만들어야 합니다.",
      color: "red",
    },
    {
      icon: RefreshCcw,
      title: "지속가능성 (Sustainability)",
      description: "재정은 다음 세대와 미래 사역으로 이어져야 합니다.",
      color: "indigo",
    },
    {
      icon: Users,
      title: "참여성 (Participation)",
      description: "모든 과정에 공동체적 참여와 책임의식을 강화해야 합니다.",
      color: "pink",
    },
  ];

  const operations = [
    {
      icon: ClipboardList,
      title: "예산의 편성",
      items: ["우선순위 설정", "비율기준", "미션과 비전점검"],
    },
    {
      icon: Calculator,
      title: "재정의 집행",
      items: ["지출 결재 절차", "계좌관리", "증빙관리 시스템"],
    },
    {
      icon: FileBarChart,
      title: "결산의 방식",
      items: ["월별/분기별 결산", "세무 기준", "손익/재정 흐름 분석"],
    },
    {
      icon: Eye,
      title: "결산의 공시",
      items: ["공개의 의미와 의무", "교인/후원자 대상 맞춤형 보고"],
    },
    {
      icon: FileSearch,
      title: "감사의 정석",
      items: ["감사위원의 역할", "감사보고서 작성"],
    },
    {
      icon: Users2,
      title: "회의의 기술",
      items: ["각 위원회 회의", "의사결정 방법과 기록 관리"],
    },
  ];

  const colorClasses: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    red: "bg-red-50 text-red-600 border-red-200",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-200",
    pink: "bg-pink-50 text-pink-600 border-pink-200",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <Breadcrumb items={[{ label: "건강한 재정관리" }]} />
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            건강한 재정관리
          </h1>
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <Activity className="w-10 h-10 text-primary" />
              </div>
              <p className="text-xl md:text-2xl text-gray-800 leading-relaxed">
                &apos;건강한재정관리&apos;는{" "}
                <span className="font-bold text-primary">
                  &apos;통제&apos;가 아닌 &apos;흐름&apos;
                </span>
                으로 생각합니다.
              </p>
              <p className="text-lg text-gray-700">
                Mission과 Fund가 만나 교회와 단체를 건강하게 세워가는 흐름을
                돕습니다.
              </p>
            </div>
          </div>
        </div>

        {/* 7 Rules Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            &apos;건강한재정관리&apos; 7가지 규칙
          </h2>
          <p className="text-center text-gray-600 mb-10">
            재정의 건강성을 위한 핵심 원칙들
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rules.map((rule, index) => {
              const Icon = rule.icon;
              const colorClass = colorClasses[rule.color];
              return (
                <Card
                  key={index}
                  className="border-2 hover:shadow-lg transition-shadow duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center gap-4">
                      <div
                        className={`w-16 h-16 ${colorClass} rounded-full flex items-center justify-center`}
                      >
                        <Icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {rule.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {rule.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Operations Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            건강한재정관리 운영
          </h2>
          <p className="text-center text-gray-600 mb-10">
            체계적인 재정 운영을 위한 실행 방법
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {operations.map((operation, index) => {
              const Icon = operation.icon;
              return (
                <Card
                  key={index}
                  className="bg-white hover:shadow-lg transition-shadow duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                          {operation.title}
                        </h3>
                        <ul className="space-y-2">
                          {operation.items.map((item, itemIndex) => (
                            <li
                              key={itemIndex}
                              className="flex items-start gap-2 text-gray-600 text-sm"
                            >
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/financial-consulting-cases"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-black font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <FileText className="w-5 h-5" />
              재정관리 컨설팅 사례
            </Link>
            <Link
              href="/financial-consulting-inquiry"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <Phone className="w-5 h-5" />
              재정관리 컨설팅 문의
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
