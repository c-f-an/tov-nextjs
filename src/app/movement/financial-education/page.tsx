"use client";

import { useState } from "react";
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb";
import PageHeader from "@/presentation/components/common/PageHeader";

interface Education {
  id: number;
  title: string;
  category: string;
  description: string;
  schedule?: string;
  duration?: string;
  level: string;
  image?: string;
}

const mockEducations: Education[] = [
  {
    id: 1,
    title: "비영리회계 기초과정",
    category: "회계기초",
    description: "비영리회계의 기본 개념부터 실무까지 체계적으로 학습합니다.",
    schedule: "매월 첫째 주 토요일",
    duration: "오전 9시-오후 1시",
    level: "초급",
  },
  {
    id: 2,
    title: "교회 재정관리 실무과정",
    category: "재정관리",
    description: "교회 특성에 맞춘 재정관리 방법과 실무를 교육합니다.",
    schedule: "매월 셋째 주 토요일",
    duration: "오전 9시-오후 1시",
    level: "중급",
  },
  {
    id: 3,
    title: "투명한 재정보고서 작성법",
    category: "보고서작성",
    description: "이해하기 쉽고 투명한 재정보고서 작성 방법을 배웁니다.",
    schedule: "분기별 1회",
    duration: "오전 10시-오후 3시",
    level: "중급",
  },
  {
    id: 4,
    title: "비영리단체 세무 기초",
    category: "세무",
    description: "비영리단체가 알아야 할 세무 기초 지식을 학습합니다.",
    schedule: "매월 둘째 주 토요일",
    duration: "오전 10시-오후 2시",
    level: "초급",
  },
  {
    id: 5,
    title: "기부금 관리 실무",
    category: "기부금관리",
    description: "효과적인 기부금 모금과 관리 방법을 배웁니다.",
    schedule: "매월 넷째 주 토요일",
    duration: "오전 10시-오후 1시",
    level: "중급",
  },
  {
    id: 6,
    title: "재정 투명성 강화 워크숍",
    category: "투명성",
    description: "조직의 재정 투명성을 높이는 실질적인 방법을 학습합니다.",
    schedule: "격월 1회",
    duration: "오전 9시-오후 4시",
    level: "고급",
  },
  {
    id: 7,
    title: "회계 소프트웨어 활용법",
    category: "전산회계",
    description: "비영리단체를 위한 회계 소프트웨어 활용법을 익힙니다.",
    schedule: "매월 첫째 주 목요일",
    duration: "오후 2시-오후 5시",
    level: "초급",
  },
  {
    id: 8,
    title: "내부감사 실무과정",
    category: "감사",
    description: "효과적인 내부감사 시스템 구축과 운영 방법을 배웁니다.",
    schedule: "분기별 1회",
    duration: "오전 10시-오후 5시",
    level: "고급",
  },
];

const categories = [
  "전체",
  "회계기초",
  "재정관리",
  "보고서작성",
  "세무",
  "기부금관리",
  "투명성",
  "전산회계",
  "감사",
];

export default function FinancialEducationPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const filteredEducations =
    selectedCategory === "전체"
      ? mockEducations
      : mockEducations.filter((edu) => edu.category === selectedCategory);

  const EducationCard = ({ education }: { education: Education }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
      <div className="mb-4">
        <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 mb-2">
          {education.category}
        </span>
        <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-700 mb-2 ml-2">
          {education.level}
        </span>
      </div>
      <h3 className="text-xl font-bold mb-2">{education.title}</h3>
      <p className="text-gray-600 mb-4">{education.description}</p>
      {education.schedule && (
        <div className="text-sm text-gray-500">
          <p className="mb-1">📅 {education.schedule}</p>
          {education.duration && <p>⏰ {education.duration}</p>}
        </div>
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <Breadcrumb
          items={[{ label: "건강한 재정교육", href: "/movement" }, { label: "건강한 재정관리" }]}
        />
        <PageHeader
          title="건강한 재정교육"
          description="투명한 숫자가 세상을 바꾸고, 정직한 재정이 희망을 이어갑니다"
        />

        <div className="mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">카테고리별 교육</h2>
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full transition-colors ${selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredEducations.map((education) => (
                <EducationCard key={education.id} education={education} />
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">전체 교육 프로그램</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockEducations.map((education) => (
                <EducationCard key={education.id} education={education} />
              ))}
            </div>
          </div>

          <div className="bg-gray-100 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">교육 문의 및 신청</h2>
            <p className="text-gray-700 mb-4">
              교육 프로그램에 참여를 원하시는 분은 아래 연락처로 문의해주세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div>
                <p className="text-gray-700">
                  <strong>전화:</strong> 02-6951-1391
                </p>
              </div>
              <div>
                <p className="text-gray-700">
                  <strong>이메일:</strong> edu@tov.or.kr
                </p>
              </div>
            </div>
            <a
              href="/consultation/apply"
              className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/80 transition-colors"
            >
              교육 신청하기
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
