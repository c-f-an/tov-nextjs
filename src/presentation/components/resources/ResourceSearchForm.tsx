"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Search, X } from "lucide-react";

interface ResourceSearchFormProps {
  categorySlug: string;
  initialSearch?: string;
}

export function ResourceSearchForm({ categorySlug, initialSearch = "" }: ResourceSearchFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(initialSearch);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (searchValue.trim()) {
      params.set("search", searchValue.trim());
    } else {
      params.delete("search");
    }
    params.delete("page"); // Reset to page 1 on new search

    startTransition(() => {
      router.push(`/resources/${categorySlug}?${params.toString()}`);
    });
  };

  const handleClear = () => {
    setSearchValue("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.delete("page");

    startTransition(() => {
      router.push(`/resources/${categorySlug}?${params.toString()}`);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-xl bg-white focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
        <Search className="ml-2 h-5 w-5 text-gray-400 flex-shrink-0" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="제목, 내용, 파일명으로 검색..."
          className="flex-1 py-1 bg-transparent focus:outline-none text-sm min-w-0"
        />
        {searchValue && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex-shrink-0"
        >
          {isPending ? "검색중..." : "검색"}
        </button>
      </div>
    </form>
  );
}
