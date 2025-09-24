"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ArrowLeft,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import PageHeader from "@/presentation/components/common/PageHeader";

const faqCategories = [
  {
    category: "종교인 소득세",
    questions: [
      {
        q: "종교인 소득과 근로소득 중 어떤 것을 선택해야 하나요?",
        a: "종교인 소득을 선택하면 필요경비 인정 범위가 넓어 절세 효과가 있습니다. 단, 교회와 목회자가 동일하게 선택해야 하며, 한번 선택하면 변경이 어렵습니다.",
      },
      {
        q: "비과세 대상 소득에는 어떤 것들이 있나요?",
        a: "사택 제공 이익(월 50만원 한도), 종교 활동비(월 20만원), 학자금, 식사대 등이 일정 한도 내에서 비과세됩니다.",
      },
      {
        q: "원천징수는 언제 해야 하나요?",
        a: "매월 소득을 지급할 때 원천징수하고, 다음 달 10일까지 세무서에 납부해야 합니다. 반기납부 승인을 받은 경우 6개월마다 납부할 수 있습니다.",
      },
    ],
  },
  {
    category: "법인세",
    questions: [
      {
        q: "종교법인도 법인세를 내야 하나요?",
        a: "종교법인은 원칙적으로 법인세가 면제되지만, 수익사업을 하는 경우 해당 수익에 대해서는 법인세를 납부해야 합니다.",
      },
      {
        q: "수익사업의 범위는 어떻게 되나요?",
        a: "부동산 임대업, 주차장 운영, 서적 판매, 카페 운영 등이 수익사업에 해당할 수 있습니다. 종교 목적에 직접 사용되는 경우는 제외됩니다.",
      },
      {
        q: "기부금 영수증 발급시 주의사항은?",
        a: "지정기부금단체로 지정받은 경우에만 세액공제용 기부금 영수증을 발급할 수 있으며, 국세청 홈택스에 발급명세를 제출해야 합니다.",
      },
    ],
  },
  {
    category: "부가가치세",
    questions: [
      {
        q: "교회도 부가가치세 신고를 해야 하나요?",
        a: "종교 활동과 관련된 용역은 면세이지만, 수익사업(카페, 서점 등)을 운영하는 경우 사업자등록과 부가가치세 신고가 필요합니다.",
      },
      {
        q: "부가가치세 환급은 어떤 경우에 가능한가요?",
        a: "면세사업과 과세사업을 겸영하는 경우, 과세사업 부분의 매입세액은 환급받을 수 있습니다. 안분계산이 필요합니다.",
      },
    ],
  },
  {
    category: "회계/결산",
    questions: [
      {
        q: "교회도 외부감사를 받아야 하나요?",
        a: "자산 100억원 이상 또는 수입 50억원 이상인 공익법인은 외부감사 대상입니다. 종교법인도 해당 기준을 충족하면 감사를 받아야 합니다.",
      },
      {
        q: "결산 공시는 언제까지 해야 하나요?",
        a: "회계연도 종료 후 4개월 이내(4월 30일)까지 국세청 공익법인 공시시스템에 결산서류를 공시해야 합니다.",
      },
    ],
  },
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFAQs = faqCategories
    .filter(
      (cat) => selectedCategory === "전체" || cat.category === selectedCategory
    )
    .map((cat) => ({
      ...cat,
      questions: cat.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.a.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((cat) => cat.questions.length > 0);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 뒤로가기 */}
      <Link
        href="/consultation"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        상담센터로 돌아가기
      </Link>

      <PageHeader
        title="자주 묻는 질문"
        description="교회 세무와 관련하여 많이 문의하시는 내용들을 정리했습니다."
      />

      {/* 검색 및 카테고리 필터 */}
      <div className="mb-8">
        <div className="mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="질문을 검색해보세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex justify-center gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory("전체")}
            className={`px-4 py-2 rounded-full transition-colors ${
              selectedCategory === "전체"
                ? "bg-primary text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            전체
          </button>
          {faqCategories.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setSelectedCategory(cat.category)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === cat.category
                  ? "bg-primary text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {cat.category}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ 목록 */}
      <div className="mx-auto space-y-6">
        {filteredFAQs.map((category) => (
          <div key={category.category}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              {category.category}
            </h2>
            <div className="space-y-3">
              {category.questions.map((faq, index) => {
                const itemId = `${category.category}-${index}`;
                const isExpanded = expandedItems.includes(itemId);

                return (
                  <Card key={index} className="overflow-hidden">
                    <button
                      onClick={() => toggleExpand(itemId)}
                      className="w-full text-left"
                    >
                      <CardHeader className="hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold pr-4">Q. {faq.q}</h3>
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          )}
                        </div>
                      </CardHeader>
                    </button>
                    {isExpanded && (
                      <CardContent className="pt-0 pb-6">
                        <div className="text-gray-700 bg-gray-50 p-4 rounded">
                          A. {faq.a}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 추가 문의 안내 */}
      <div className="mt-12 text-center bg-gray-50 rounded-lg p-8">
        <h3 className="text-lg font-bold mb-4">찾으시는 답변이 없으신가요?</h3>
        <p className="text-gray-600 mb-6">
          전문 상담사가 직접 답변해 드립니다.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/consultation"
            className="px-6 py-3 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
          >
            온라인 상담 신청
          </Link>
          <button className="px-6 py-3 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">
            전화 상담: 02-6951-1391
          </button>
        </div>
      </div>
    </div>
  );
}
