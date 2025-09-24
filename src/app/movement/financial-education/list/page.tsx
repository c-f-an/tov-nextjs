"use client";

import { useState } from "react";
import Link from "next/link";
import PageHeader from "@/presentation/components/common/PageHeader";

interface EducationItem {
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  category: string;
  tags: string[];
  type: "advanced" | "feminism" | "online";
}

const educationData: EducationItem[] = [
  {
    id: "1",
    title: "[몸짓상점회] 톨 화이트 TMT (선생님, 용돈 좀)",
    thumbnail: "/images/education-1.jpg",
    category: "교육심화",
    tags: ["워크숍", "실기"],
    type: "advanced",
  },
  {
    id: "2",
    title: "공공시민으로 가는 길",
    thumbnail: "/images/education-2.jpg",
    category: "교육심화",
    tags: ["강의", "정치"],
    type: "advanced",
  },
  {
    id: "3",
    title: "한국의 청년정치 살펴보기",
    thumbnail: "/images/education-3.jpg",
    category: "교육심화",
    tags: ["강의", "청년"],
    type: "advanced",
  },
  {
    id: "4",
    title: "지금 우리의 문제, 우리의 과제",
    thumbnail: "/images/education-4.jpg",
    category: "교육심화",
    tags: ["토론", "사회"],
    type: "advanced",
  },
  {
    id: "5",
    title: "여성의 몸과 건강",
    thumbnail: "/images/education-5.jpg",
    category: "페미니즘/젠더",
    tags: ["강의", "건강"],
    type: "feminism",
  },
  {
    id: "6",
    title: "젠더 평등을 위한 대화법",
    thumbnail: "/images/education-6.jpg",
    category: "페미니즘/젠더",
    tags: ["워크숍", "소통"],
    type: "feminism",
  },
  {
    id: "7",
    title: "일상 속 성차별 인식하기",
    thumbnail: "/images/education-7.jpg",
    category: "페미니즘/젠더",
    tags: ["토론", "일상"],
    type: "feminism",
  },
  {
    id: "8",
    title: "여성 리더십의 새로운 패러다임",
    thumbnail: "/images/education-8.jpg",
    category: "페미니즘/젠더",
    tags: ["강의", "리더십"],
    type: "feminism",
  },
  {
    id: "9",
    title: "재정관리의 기본 원칙",
    thumbnail: "/images/online-1.jpg",
    category: "온라인 강의",
    tags: ["기초", "재정", "입문"],
    type: "online",
  },
  {
    id: "10",
    title: "투명한 회계 시스템 구축하기",
    thumbnail: "/images/online-2.jpg",
    category: "온라인 강의",
    tags: ["실무", "회계", "시스템"],
    type: "online",
  },
  {
    id: "11",
    title: "비영리단체 세무 가이드",
    thumbnail: "/images/online-3.jpg",
    category: "온라인 강의",
    tags: ["세무", "비영리", "가이드"],
    type: "online",
  },
];

const tagColors: { [key: string]: string } = {
  워크숍: "bg-purple-100 text-purple-700",
  실기: "bg-orange-100 text-orange-700",
  강의: "bg-blue-100 text-blue-700",
  정치: "bg-red-100 text-red-700",
  청년: "bg-green-100 text-green-700",
  토론: "bg-yellow-100 text-yellow-700",
  사회: "bg-indigo-100 text-indigo-700",
  건강: "bg-pink-100 text-pink-700",
  소통: "bg-teal-100 text-teal-700",
  일상: "bg-gray-100 text-gray-700",
  리더십: "bg-purple-100 text-purple-700",
  기초: "bg-blue-100 text-blue-700",
  재정: "bg-green-100 text-green-700",
  입문: "bg-orange-100 text-orange-700",
  실무: "bg-indigo-100 text-indigo-700",
  회계: "bg-red-100 text-red-700",
  시스템: "bg-yellow-100 text-yellow-700",
  세무: "bg-teal-100 text-teal-700",
  비영리: "bg-purple-100 text-purple-700",
  가이드: "bg-pink-100 text-pink-700",
};

const EducationCard = ({ item }: { item: EducationItem }) => (
  <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden">
    <div className="aspect-w-16 aspect-h-9 relative h-48 bg-gray-200">
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
        <svg
          className="w-16 h-16"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    </div>
    <div className="p-5">
      <h3 className="font-semibold text-lg mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
        {item.title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {item.tags.map((tag, index) => (
          <span
            key={index}
            className={`px-3 py-1 text-xs font-medium rounded-full ${
              tagColors[tag] || "bg-gray-100 text-gray-700"
            }`}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const LectureCard = ({ item }: { item: EducationItem }) => (
  <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden">
    <div className="aspect-w-16 aspect-h-9 relative h-40 bg-gray-200">
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-base mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
        {item.title}
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {item.tags.map((tag, index) => (
          <span
            key={index}
            className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
              tagColors[tag] || "bg-gray-100 text-gray-700"
            }`}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const EducationSection = ({
  title,
  description,
  items,
  bgColor = "bg-orange-50",
}: {
  title: string;
  description: string;
  items: EducationItem[];
  bgColor?: string;
}) => (
  <section className={`py-16 ${bgColor}`}>
    <div className="container mx-auto px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4">
            <h2 className="text-3xl font-bold mb-4">{title}</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {description}
            </p>
            <Link
              href="/movement/financial-education"
              className="inline-flex items-center mt-6 text-purple-600 hover:text-purple-700 font-medium group"
            >
              더 많은 교육 보기
              <svg
                className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          <div className="lg:col-span-8">
            <div className="grid sm:grid-cols-2 gap-6">
              {items.map((item) => (
                <EducationCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default function EducationListPage() {
  const advancedEducations = educationData.filter(
    (item) => item.type === "advanced"
  );
  const feminismEducations = educationData.filter(
    (item) => item.type === "feminism"
  );
  const onlineEducations = educationData.filter(
    (item) => item.type === "online"
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-white py-12 border-b">
        <div className="container mx-auto px-4">
          <PageHeader
            title="재정교육 프로그램"
            description="투명한 재정관리를 위한 체계적인 교육 프로그램을 제공합니다"
            className="text-center"
          />
        </div>
      </div>

      <EducationSection
        title="교육심화"
        description="재정관리의 기본부터 심화 과정까지, 단계별로 체계적인 교육을 제공합니다. 실무에 바로 적용할 수 있는 실용적인 내용으로 구성되어 있습니다."
        items={advancedEducations}
        bgColor="bg-orange-50"
      />

      <EducationSection
        title="페미니즘/젠더"
        description="성평등한 조직문화와 재정관리를 위한 특별 교육 과정입니다. 젠더 감수성을 바탕으로 한 포용적인 재정 운영을 배웁니다."
        items={feminismEducations}
        bgColor="bg-purple-50"
      />

      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              온라인 강의 보기
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {onlineEducations.map((item) => (
                <LectureCard key={item.id} item={item} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/movement/financial-education/online"
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors group"
              >
                모든 온라인 강의 보기
                <svg
                  className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">교육 문의</h2>
            <p className="text-lg text-gray-600 mb-8">
              맞춤형 교육이 필요하신가요? 언제든지 문의해주세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:02-6951-1391"
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                02-6951-1391
              </a>
              <a
                href="mailto:tov.npo@gmail.com"
                className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                tov.npo@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
