"use client";

import { useState, useEffect } from "react";
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb";
import PageHeader from "@/presentation/components/common/PageHeader";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  sortOrder: number;
  isActive: boolean;
  viewCount: number;
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<Record<string, FAQ[]>>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async (search?: string) => {
    try {
      const params = new URLSearchParams();
      if (search) {
        params.append("search", search);
      }

      const response = await fetch(`/api/faqs?${params}`);
      if (!response.ok) throw new Error("Failed to fetch FAQs");

      const data = await response.json();
      setFaqs(data.faqs);
      setCategories(data.categories);

      // Select first category if none selected
      if (!selectedCategory && data.categories.length > 0) {
        setSelectedCategory(data.categories[0]);
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFAQs(searchQuery);
  };

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const displayedFAQs = selectedCategory ? faqs[selectedCategory] || [] : [];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <Breadcrumb
          items={[
            { label: "About Us", href: "/about" },
            { label: "자주 묻는 질문" },
          ]}
        />
        <PageHeader
          title="자주 묻는 질문"
          description="자주 묻는 질문과 답변을 확인해보세요."
        />

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="궁금하신 내용을 검색해보세요"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/80"
            >
              검색
            </button>
          </div>
        </form>

        {/* Category Tabs */}
        <div className="border-b mb-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  selectedCategory === category
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </nav>
        </div>

        {/* FAQ List */}
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedFAQs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">등록된 FAQ가 없습니다.</p>
              </div>
            ) : (
              displayedFAQs.map((faq) => (
                <div key={faq.id} className="bg-white border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleExpand(faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-accent"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-primary font-medium mt-0.5">Q</span>
                      <span className="text-gray-900">{faq.question}</span>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedItems.has(faq.id) ? "transform rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {expandedItems.has(faq.id) && (
                    <div className="px-6 pb-4 border-t border-gray-100">
                      <div className="flex items-start space-x-3 pt-4">
                        <span className="text-secondary font-medium mt-0.5">
                          A
                        </span>
                        <div
                          className="text-gray-700 prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: faq.answer }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Contact Info */}
        <div className="mt-12 p-6 bg-white border border-gray-200 rounded-lg text-center shadow-sm">
          <p className="text-gray-700 mb-2">찾으시는 답변이 없으신가요?</p>
          <p className="text-gray-600">
            고객센터: 02-6951-1391 | 이메일: tov.npo@gmail.com
          </p>
          <a
            href="/consultation/apply"
            className="inline-block mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/80"
          >
            1:1 문의하기
          </a>
        </div>
      </div>
    </main>
  );
}
