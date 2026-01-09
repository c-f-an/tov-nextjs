"use client";

import { NewsCard } from "./NewsCard";
import { useState } from "react";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  date: string;
  author: string;
  category: string;
  imageUrl?: string;
  views?: number;
}

interface NewsCardGridProps {
  items: NewsItem[];
  category: string;
  basePath: string;
}

export function NewsCardGrid({ items, category, basePath }: NewsCardGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "popular">("latest");

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return (b.views || 0) - (a.views || 0);
    }
  });

  return (
    <div>
      {/* Search and Filter */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy("latest")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              sortBy === "latest"
                ? "bg-primary text-primary-foreground"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            최신순
          </button>
          <button
            onClick={() => setSortBy("popular")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              sortBy === "popular"
                ? "bg-primary text-primary-foreground"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            인기순
          </button>
        </div>
      </div>

      {/* Grid */}
      {sortedItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedItems.map((item) => (
            <NewsCard
              key={item.id}
              {...item}
              href={`${basePath}/${item.id}`}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">검색 결과가 없습니다.</p>
        </div>
      )}

      {/* Pagination (placeholder) */}
      <div className="mt-8 flex justify-center">
        <nav className="flex items-center gap-2">
          <button className="px-3 py-1 rounded-lg bg-gray-100 text-gray-400" disabled>
            이전
          </button>
          <button className="px-3 py-1 rounded-lg bg-primary text-primary-foreground">1</button>
          <button className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200">2</button>
          <button className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200">3</button>
          <button className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200">
            다음
          </button>
        </nav>
      </div>
    </div>
  );
}