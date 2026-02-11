"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Newspaper, Book, Gavel } from "lucide-react";

export type NewsCategory = 'all' | 'notice' | 'activity' | 'media' | 'publication' | 'laws';

interface CategoryFilterProps {
  selectedCategory: NewsCategory;
  onCategoryChange: (category: NewsCategory) => void;
}

const categories = [
  { value: 'all' as NewsCategory, label: '전체', icon: null },
  { value: 'notice' as NewsCategory, label: '공지사항', icon: FileText },
  { value: 'activity' as NewsCategory, label: '활동소식', icon: Calendar },
  { value: 'media' as NewsCategory, label: '언론보도', icon: Newspaper },
  { value: 'publication' as NewsCategory, label: '정기간행물', icon: Book },
  { value: 'laws' as NewsCategory, label: '관계법령 소식', icon: Gavel },
];

export default function CategoryFilter({
  selectedCategory,
  onCategoryChange
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((category) => {
        const Icon = category.icon;
        const isActive = selectedCategory === category.value;

        return (
          <Button
            key={category.value}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category.value)}
            className="flex items-center gap-2"
          >
            {Icon ? <Icon className="h-4 w-4" /> : null}
            {category.label}
          </Button>
        );
      })}
    </div>
  );
}