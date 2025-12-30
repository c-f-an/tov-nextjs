"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/presentation/contexts/AuthContext";
import { ReportFileUpload } from "@/presentation/components/common/ReportFileUpload";

function NewReportForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { accessToken } = useAuth();

  // URL에서 현재 타입을 가져옵니다.
  const currentType =
    (searchParams.get("type") as "business" | "finance") || "business";

  const [formData, setFormData] = useState({
    title: "",
    year: new Date().getFullYear().toString(),
    date: new Date().toISOString().split("T")[0],
    type: currentType,
    summary: "",
    content: "",
    file_url: "",
    is_active: true,
  });

  // URL의 type 파라미터가 변경될 때마다 state를 업데이트합니다.
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      type: currentType,
    }));
  }, [currentType]); // currentType이 바뀔 때마다 실행

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.year || !formData.date) {
      alert("제목, 연도, 날짜는 필수 입력 항목입니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create report");
      }

      const result = await response.json();
      alert("보고서가 성공적으로 등록되었습니다.");
      router.push("/admin/reports");
    } catch (error) {
      console.error("Error creating report:", error);
      alert("보고서 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">새 보고서 작성</h1>
        <p className="text-gray-600 mt-1">
          {formData.type === "business" ? "사업보고서" : "재정보고서"}를
          작성합니다
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        {/* Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            보고서 유형 <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({
                ...formData,
                type: e.target.value as "business" | "finance",
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="business">사업보고</option>
            <option value="finance">재정보고</option>
          </select>
        </div>

        {/* Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            제목 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="예: 2024년 토브협회 사업보고서"
            required
          />
        </div>

        {/* Year and Date */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              연도 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.year}
              onChange={(e) =>
                setFormData({ ...formData, year: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="2024"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              작성일 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Summary */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            요약
          </label>
          <textarea
            value={formData.summary}
            onChange={(e) =>
              setFormData({ ...formData, summary: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="보고서 요약 내용을 입력하세요"
          />
        </div>

        {/* Content */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            내용
          </label>
          <textarea
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={15}
            placeholder="보고서 본문 내용을 입력하세요. HTML 태그를 사용할 수 있습니다."
          />
          <p className="mt-2 text-sm text-gray-500">
            HTML 형식으로 작성하실 수 있습니다.
          </p>
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            첨부 파일
          </label>
          <div className="space-y-3">
            <ReportFileUpload
              onUploadSuccess={(url) =>
                setFormData({ ...formData, file_url: url })
              }
              onUploadError={(error) => alert(error)}
              type={formData.type}
              year={formData.year}
              buttonText="파일 업로드 (PDF, 문서, 이미지)"
              maxSize={50}
            />
            {formData.file_url && (
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    파일이 업로드되었습니다
                  </p>
                  <a
                    href={formData.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline break-all"
                  >
                    {formData.file_url}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, file_url: "" })}
                  className="text-red-600 hover:text-red-700"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            PDF 파일 또는 이미지 파일을 업로드하세요 (최대 50MB)
          </p>
        </div>

        {/* Is Active */}
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">활성화</span>
          </label>
          <p className="mt-1 text-sm text-gray-500">
            체크 해제 시 웹사이트에 표시되지 않습니다.
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isSubmitting ? "등록 중..." : "보고서 등록"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NewReportPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">로딩 중...</p>
          </div>
        </div>
      }
    >
      <NewReportForm />
    </Suspense>
  );
}
