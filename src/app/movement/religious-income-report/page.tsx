"use client";

import React from "react";
import Link from "next/link";
import {
  Building,
  Heart,
  TrendingUp,
  ExternalLink,
  FileText,
  Calculator,
  UserCheck,
  Handshake,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb";
import PageHeader from "@/presentation/components/common/PageHeader";

export default function ReligiousIncomeReportPage() {
  const sections = [
    {
      icon: Building,
      title: "투명한 재정은 교회의 신뢰를 강화합니다",
      description:
        "자발적인 소득 신고는 교회 재정이 투명하게 운영되고 있음을 증명합니다. 이는 교인들에게 신뢰와 안심을 제공하며, 교회가 사회 속에서 공적 책임을 다하고 있음을 보여주는 기초가 됩니다.",
      color: "blue",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      cardBg: "bg-gradient-to-br from-blue-50 to-blue-100",
    },
    {
      icon: TrendingUp,
      title: "미래는 정직한 발걸음 위에 세워집니다",
      description:
        "종교인 소득 신고는 목회자 개인과 가정의 미래와도 직결됩니다. 국민연금, 건강보험 등 복지 제도는 신고를 통해서만 보장되며, 안정된 목회 사역과 노후 준비를 가능하게 합니다. 따라서 소득 신고는 선택이 아니라, 교회와 목회자의 미래를 지키는 약속입니다.",
      color: "green",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      cardBg: "bg-gradient-to-br from-green-50 to-green-100",
    },
    {
      icon: Heart,
      title: "작은 순종이 큰 변화를 이끕니다",
      description:
        '"적은 일에 충성된 자가 큰 일에도 충성된다"(눅 16:10)는 말씀처럼, 소득 신고라는 작은 순종이 한국교회의 신뢰 회복과 사회적 모범으로서의 위치를 굳건히 하는 첫걸음이 될 것입니다.',
      color: "purple",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      cardBg: "bg-gradient-to-br from-purple-50 to-purple-100",
    },
  ];

  const ptaxFeatures = [
    {
      icon: FileText,
      title: "온라인 소득신고 시스템",
      description:
        "P-Tax(피택스, ptax.kr)는 사례비·활동비 등 종교인 소득을 정확하게 신고하고, 세금을 납부할 수 있도록 돕는 '목회자 전용 온라인 소득신고 시스템'입니다.",
      color: "indigo",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      cardBg: "bg-gradient-to-br from-indigo-50 to-indigo-100",
    },
    {
      icon: Calculator,
      title: "자동 세액 계산",
      description:
        "목회자가 매월 받는 사례비, 목회활동비, 비과세 항목 등을 입력하면, 공제할 세액을 자동으로 계산하고, 급여·사례비 대장과 국세청 신고용 전자 파일까지 한 번에 생성하여 종교인소득신고를 돕습니다.",
      color: "emerald",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      cardBg: "bg-gradient-to-br from-emerald-50 to-emerald-100",
    },
    {
      icon: UserCheck,
      title: "무료 신고 지원",
      description:
        "세무신고가 익숙하지 않은 작은교회 목회자도 '무료'로 소득세 신고를 지원받을 수 있으며, 필요한 경우 P-Tax와 연계된 전문가의 도움을 받을 수 있습니다.",
      color: "amber",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      cardBg: "bg-gradient-to-br from-amber-50 to-amber-100",
    },
    {
      icon: Handshake,
      title: "함께하는 동반자",
      description:
        "목회자들의 종교인소득신고를 혼자 고민하지 않도록, P-Tax는 목회자의 종교인소득신고 여정을 처음부터 끝까지 함께하는 동반자입니다.",
      color: "rose",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
      cardBg: "bg-gradient-to-br from-rose-50 to-rose-100",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">

        <PageHeader
          title={<></>}
          description=""
          backgroundImage="/menu-header/header-bg-movement-income-report.webp"
          overlayColor="#00357f"
          overlayOpacity={0}
        >
          <Breadcrumb
            items={[{ label: "토브운동", href: "/movement" }, { label: "종교인 소득신고" }]}
            variant="light"
          />
        </PageHeader>

        {/* Hero Section */}
        <div className="text-center mb-16">

          {/* Main Message Card */}
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-0 shadow-xl mb-12">
            <CardContent className="p-8 md:p-12">
              <p className="text-lg md:text-xl text-gray-800 leading-relaxed">
                종교인 소득 신고는 단순한 세무 행정 절차가 아닙니다.
                <br />
                이것은{" "}
                <span className="font-bold">
                  하나님 앞에서 우리의 정직함을 드러내는 거룩한 순종
                </span>
                이며,
                <br />
                교회가 세상의 빛과 소금으로서 신뢰를 세우고 다음 세대에 바른
                유산을 남기는
                <span className="font-bold"> 책임 있는 행동</span>입니다.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Infographic Sections */}
        <div className="space-y-8 mb-16">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card
                key={index}
                className={`${section.cardBg} border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
              >
                <CardContent className="p-8 md:p-10">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div
                      className={`w-24 h-24 ${section.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className={`w-12 h-12 ${section.iconColor}`} />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {section.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* P-Tax Introduction Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              P-Tax 소개
            </h2>
            <p className="text-lg text-gray-600">
              목회자를 위한 전용 온라인 소득신고 시스템
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {ptaxFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className={`${feature.cardBg} border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 pt-6">
                      <div
                        className={`w-16 h-16 ${feature.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className={`w-8 h-8 ${feature.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center px-12 mb-10">
          <Link
            href="https://ptax.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-bold text-lg rounded-full hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            P-TAX 서비스로 이동
            <ExternalLink className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </main>
  );
}
