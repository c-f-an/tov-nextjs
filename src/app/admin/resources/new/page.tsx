"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/presentation/contexts/AuthContext";
import { Editor } from "@/presentation/components/admin/Editor";
import Link from "next/link";

interface ResourceCategory {
  id: number;
  name: string;
  slug: string;
}

export default function NewResourcePage() {
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [formData, setFormData] = useState({
    categoryId: "",
    title: "",
    description: "",
    resourceType: "etc",
    externalLink: "",
    externalLinkTitle: "",
    isFeatured: false,
    isActive: true,
    publishedAt: new Date().toISOString().split("T")[0],
  });
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      router.push("/login?redirect=/admin/resources/new");
      return;
    }
    fetchCategories();
  }, [user]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/resources/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Copy files to array before resetting input
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
      // Reset input to allow selecting the same file again
      e.target.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.categoryId || !formData.title) {
      alert("카테고리와 제목은 필수 항목입니다.");
      return;
    }

    if (files.length === 0 && !formData.externalLink) {
      alert("파일 또는 외부 링크 중 하나는 필수입니다.");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create resource first (without file info)
      const resourceData = {
        ...formData,
        categoryId: parseInt(formData.categoryId),
        createdBy: user?.id,
      };

      const response = await fetch("/api/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(resourceData),
      });

      if (!response.ok) {
        throw new Error("자료 등록에 실패했습니다.");
      }

      const createdResource = await response.json();

      // Step 2: Upload files if provided (with resource ID in filename)
      if (files.length > 0) {
        const uploadFormData = new FormData();
        files.forEach((file) => {
          uploadFormData.append("files", file);
        });
        uploadFormData.append("resourceId", createdResource.id.toString());

        const uploadResponse = await fetch("/api/resources/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json().catch(() => ({}));
          throw new Error(errorData.error || "파일 업로드에 실패했습니다.");
        }
      }

      alert("자료가 등록되었습니다.");
      router.push("/admin/resources");
    } catch (error) {
      console.error("Failed to create resource:", error);
      alert(
        error instanceof Error ? error.message : "등록 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">새 자료 추가</h1>
        <Link
          href="/admin/resources"
          className="text-gray-600 hover:text-gray-800"
        >
          목록으로 돌아가기
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-2 gap-6">
          {/* 카테고리 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              카테고리 *
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="">카테고리 선택</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* 자료 유형 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              자료 유형
            </label>
            <select
              value={formData.resourceType}
              onChange={(e) =>
                setFormData({ ...formData, resourceType: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            >
              <option value="guide">가이드</option>
              <option value="form">서식</option>
              <option value="education">교육자료</option>
              <option value="law">법령</option>
              <option value="etc">기타</option>
            </select>
          </div>
        </div>

        {/* 제목 */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            제목 *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* 설명 */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            설명
          </label>
          <Editor
            value={formData.description}
            onChange={(value) =>
              setFormData({ ...formData, description: value })
            }
            placeholder="자료에 대한 설명을 입력하세요..."
            minHeight="200px"
          />
        </div>

        {/* 파일 업로드 */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            파일 업로드 (여러 파일 선택 가능)
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full border rounded px-3 py-2"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.hwp,.zip,.jpg,.jpeg,.png,.gif,.webp,.svg"
            multiple
          />
          <p className="text-sm text-gray-500 mt-1">
            PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, HWP, ZIP, JPG, PNG 파일 가능
          </p>

          {/* 선택된 파일 목록 */}
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-gray-700">
                선택된 파일 ({files.length}개)
              </p>
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded border"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="ml-4 text-red-600 hover:text-red-800 text-sm"
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 외부 링크 */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            외부 링크 (파일 대신 링크 제공 시)
          </label>
          <input
            type="url"
            value={formData.externalLink}
            onChange={(e) =>
              setFormData({ ...formData, externalLink: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
            placeholder="https://..."
          />
          <p className="text-sm text-gray-500 mt-1">
            유튜브 링크는 'https://www.youtube.com/'으로 시작하는 링크를
            넣어주세요.
          </p>
        </div>

        {/* 외부 링크 버튼 제목 */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            외부 링크 버튼 제목
          </label>
          <input
            type="text"
            value={formData.externalLinkTitle}
            onChange={(e) =>
              setFormData({ ...formData, externalLinkTitle: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
            placeholder="예: 사이트 바로가기, 온라인 신청하기"
          />
          <p className="text-sm text-gray-500 mt-1">
            외부 링크가 있을 때 버튼에 표시될 텍스트입니다.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">
          {/* 게시일 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              게시일
            </label>
            <input
              type="date"
              value={formData.publishedAt}
              onChange={(e) =>
                setFormData({ ...formData, publishedAt: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* 옵션 */}
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) =>
                  setFormData({ ...formData, isFeatured: e.target.checked })
                }
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                주요 자료로 표시
              </span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                즉시 공개
              </span>
            </label>
          </div>
        </div>

        {/* 버튼 */}
        <div className="mt-8 flex justify-end space-x-4">
          <Link
            href="/admin/resources"
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "저장중..." : "저장"}
          </button>
        </div>
      </form>
    </div>
  );
}
