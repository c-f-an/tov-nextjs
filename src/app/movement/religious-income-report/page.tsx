"use client";

import React from "react";
import Link from "next/link";
import {
  Building,
  Heart,
  Shield,
  TrendingUp,
  Users,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb";

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

  const benefits = [
    {
      icon: Shield,
      title: "사회 보장",
      items: ["국민연금 가입", "건강보험 혜택", "고용보험 보호"],
    },
    {
      icon: Users,
      title: "교회 신뢰",
      items: ["투명한 재정 운영", "교인들의 신뢰 증대", "사회적 책임 이행"],
    },
    {
      icon: CheckCircle,
      title: "정직한 신앙",
      items: ["믿음의 실천", "다음 세대 본보기", "거룩한 순종"],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <Breadcrumb items={[{ label: "종교인 소득신고" }]} />
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            종교인 소득신고
          </h1>
          <p className="text-2xl md:text-3xl text-primary font-semibold mb-12">
            정직은 믿음의 또 다른 이름입니다
          </p>

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

        {/* CTA Section */}
        <div className="text-center p-12">
          <Link
            href="https://ptax.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-primary font-bold text-lg rounded-full hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            P-TAX 서비스로 이동
            <ExternalLink className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
