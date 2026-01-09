"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/presentation/contexts/AuthContext";
import Link from "next/link";

interface ResourceCategory {
  id: number;
  name: string;
  slug: string;
}

interface Resource {
  id: number;
  categoryId: number;
  title: string;
  description: string | null;
  resourceType: string;
  fileType: string | null;
  originalFilename: string | null;
  filePath: string | null;
  fileSize: number | null;
  externalLink: string | null;
  externalLinkTitle: string | null;
  downloadCount: number;
  viewCount: number;
  isFeatured: boolean;
  isActive: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function EditResourcePage() {
  const router = useRouter();
  const params = useParams();
  const resourceId = params?.id as string;
  const { user, accessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [resource, setResource] = useState<Resource | null>(null);
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
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      router.push("/login?redirect=/admin/resources");
      return;
    }
    fetchCategories();
    fetchResource();
  }, [user, resourceId]);

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

  const fetchResource = async () => {
    if (!accessToken || !resourceId) return;

    try {
      setFetching(true);
      const response = await fetch(`/api/resources/${resourceId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResource(data);
        setFormData({
          categoryId: data.categoryId.toString(),
          title: data.title,
          description: data.description || "",
          resourceType: data.resourceType,
          externalLink: data.externalLink || "",
          externalLinkTitle: data.externalLinkTitle || "",
          isFeatured: data.isFeatured,
          isActive: data.isActive,
          publishedAt: data.publishedAt
            ? new Date(data.publishedAt).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
        });
      } else {
        alert("자료를 불러오는데 실패했습니다.");
        router.push("/admin/resources");
      }
    } catch (error) {
      console.error("Failed to fetch resource:", error);
      alert("자료를 불러오는데 실패했습니다.");
      router.push("/admin/resources");
    } finally {
      setFetching(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDownload = async () => {
    if (!resource?.filePath || !resourceId) return;

    try {
      const response = await fetch(`/api/resources/${resourceId}/download`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = resource.originalFilename || "download";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("파일 다운로드에 실패했습니다.");
      }
    } catch (error) {
      console.error("Failed to download file:", error);
      alert("다운로드 중 오류가 발생했습니다.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.categoryId || !formData.title) {
      alert("카테고리와 제목은 필수 항목입니다.");
      return;
    }

    // 새 파일이 없고, 기존 파일도 없고, 외부 링크도 없으면 에러
    if (!file && !resource?.filePath && !formData.externalLink) {
      alert("파일 또는 외부 링크 중 하나는 필수입니다.");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Update resource info first
      const resourceData = {
        ...formData,
        categoryId: parseInt(formData.categoryId),
      };

      const response = await fetch(`/api/resources/${resourceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(resourceData),
      });

      if (!response.ok) {
        throw new Error("자료 수정에 실패했습니다.");
      }

      // Step 2: Upload new file if provided (with resource ID in filename)
      if (file) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        uploadFormData.append("resourceId", resourceId);

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

      alert("자료가 수정되었습니다.");
      router.push("/admin/resources");
    } catch (error) {
      console.error("Failed to update resource:", error);
      alert(
        error instanceof Error ? error.message : "수정 중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">자료 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">자료 수정</h1>
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
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
            rows={4}
          />
        </div>

        {/* 현재 파일 정보 */}
        {resource?.filePath && (
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <div className="flex justify-between items-start mb-2">
              <label className="block text-sm font-medium text-gray-700">
                현재 파일
              </label>
              <button
                type="button"
                onClick={handleDownload}
                className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                다운로드
              </button>
            </div>
            <div className="text-sm text-gray-600">
              <p>파일명: {resource.originalFilename}</p>
              <p>파일 타입: {resource.fileType}</p>
              <p>
                파일 크기:{" "}
                {resource.fileSize
                  ? `${(resource.fileSize / 1024).toFixed(2)} KB`
                  : "N/A"}
              </p>
            </div>
          </div>
        )}

        {/* 파일 업로드 (새 파일로 교체) */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {resource?.filePath ? "새 파일로 교체 (선택사항)" : "파일 업로드"}
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full border rounded px-3 py-2"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.hwp,.zip"
          />
          <p className="text-sm text-gray-500 mt-1">
            PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, HWP, ZIP 파일만 가능합니다.
          </p>
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
              <span className="text-sm font-medium text-gray-700">공개</span>
            </label>
          </div>
        </div>

        {/* 통계 정보 */}
        {resource && (
          <div className="mt-6 p-4 bg-blue-50 rounded">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              통계 정보
            </h3>
            <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-medium">다운로드</p>
                <p>{resource.downloadCount}회</p>
              </div>
              <div>
                <p className="font-medium">조회</p>
                <p>{resource.viewCount}회</p>
              </div>
              <div>
                <p className="font-medium">등록일</p>
                <p>{new Date(resource.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}

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
            {loading ? "수정중..." : "수정"}
          </button>
        </div>
      </form>
    </div>
  );
}
