"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/presentation/contexts/AuthContext";
import { Editor } from "@/presentation/components/admin/Editor";
import Link from "next/link";

interface ResourceCategory {
  id: number;
  name: string;
  slug: string;
}

interface ResourceType {
  id: number;
  name: string;
  code: string;
  sortOrder: number;
}

interface ResourceFile {
  id: number;
  resourceId: number;
  filePath: string;
  originalFilename: string;
  fileType: string;
  fileSize: number;
  sortOrder: number;
  downloadCount: number;
  createdAt: string;
}

interface Resource {
  id: number;
  categoryId: number;
  title: string;
  description: string | null;
  resourceTypes?: ResourceType[];
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
  files?: ResourceFile[];
}

export default function EditResourcePage() {
  const router = useRouter();
  const params = useParams();
  const resourceId = params?.id as string;
  const { user, accessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [availableTypes, setAvailableTypes] = useState<ResourceType[]>([]);
  const [resource, setResource] = useState<Resource | null>(null);
  const [existingFiles, setExistingFiles] = useState<ResourceFile[]>([]);
  const [formData, setFormData] = useState({
    categoryId: "",
    title: "",
    slug: "",
    description: "",
    resourceTypes: [] as string[],
    externalLink: "",
    externalLinkTitle: "",
    isFeatured: false,
    isActive: true,
    publishedAt: new Date().toISOString().split("T")[0],
  });
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [slugError, setSlugError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      router.push("/login?redirect=/admin/resources");
      return;
    }
    fetchCategories();
    fetchResourceTypes();
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

  const fetchResourceTypes = async () => {
    try {
      const response = await fetch("/api/resources/types");
      if (response.ok) {
        const data = await response.json();
        setAvailableTypes(data);
      }
    } catch (error) {
      console.error("Failed to fetch resource types:", error);
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
        setExistingFiles(data.files || []);
        setFormData({
          categoryId: data.categoryId.toString(),
          title: data.title,
          slug: data.slug || "",
          description: data.description || "",
          resourceTypes: data.resourceTypes?.map((t: ResourceType) => t.code) || [],
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

  const handleTypeToggle = (code: string) => {
    setFormData((prev) => {
      const types = prev.resourceTypes.includes(code)
        ? prev.resourceTypes.filter((t) => t !== code)
        : [...prev.resourceTypes, code];
      return { ...prev, resourceTypes: types };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setNewFiles((prev) => [...prev, ...selectedFiles]);
      e.target.value = "";
    }
  };

  const handleRemoveNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingFile = async (fileId: number) => {
    if (!confirm("이 파일을 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(
        `/api/resources/${resourceId}/files/${fileId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        setExistingFiles((prev) => prev.filter((f) => f.id !== fileId));
        alert("파일이 삭제되었습니다.");
      } else {
        alert("파일 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("Failed to delete file:", error);
      alert("파일 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleDownload = async (fileId?: number) => {
    try {
      const url = fileId
        ? `/api/resources/${resourceId}/download?fileId=${fileId}`
        : `/api/resources/${resourceId}/download`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;

        const contentDisposition = response.headers.get("Content-Disposition");
        let filename = "download";
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+)"/);
          if (match) {
            filename = decodeURIComponent(match[1]);
          }
        }

        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
      } else {
        alert("파일 다운로드에 실패했습니다.");
      }
    } catch (error) {
      console.error("Failed to download file:", error);
      alert("다운로드 중 오류가 발생했습니다.");
    }
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

    if (!formData.slug.trim()) {
      alert("Slug를 입력해주세요.");
      return;
    }

    if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      alert("Slug는 영문 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.");
      return;
    }

    if (
      existingFiles.length === 0 &&
      newFiles.length === 0 &&
      !formData.externalLink
    ) {
      alert("파일 또는 외부 링크 중 하나는 필수입니다.");
      return;
    }

    if (formData.resourceTypes.length === 0) {
      alert("자료 유형을 하나 이상 선택해주세요.");
      return;
    }

    setLoading(true);

    try {
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

      if (newFiles.length > 0) {
        const uploadFormData = new FormData();
        newFiles.forEach((file) => {
          uploadFormData.append("files", file);
        });
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
      <div className="flex items-center justify-center min-h-[400px]">
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

        {/* 자료 유형 (다중 선택) */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            자료 유형 * (복수 선택 가능)
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {availableTypes.map((type) => (
              <label
                key={type.id}
                className={`flex items-center gap-2 p-2 border rounded cursor-pointer transition-colors ${
                  formData.resourceTypes.includes(type.code)
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.resourceTypes.includes(type.code)}
                  onChange={() => handleTypeToggle(type.code)}
                  className="sr-only"
                />
                <span className="text-sm">{type.name}</span>
              </label>
            ))}
          </div>
          {formData.resourceTypes.length > 0 && (
            <p className="mt-2 text-sm text-gray-500">
              선택됨: {formData.resourceTypes.map((code) =>
                availableTypes.find((t) => t.code === code)?.name
              ).join(", ")}
            </p>
          )}
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

        {/* Slug */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slug (URL 경로) *
          </label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => {
              const value = e.target.value.toLowerCase();
              if (/^[a-z0-9-]*$/.test(value)) {
                setFormData({ ...formData, slug: value });
                setSlugError("");
              } else {
                setSlugError("영문 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.");
              }
            }}
            placeholder="예: tax-guide-2024"
            className={`w-full border rounded px-3 py-2 ${slugError ? "border-red-500" : ""}`}
            required
          />
          {slugError && (
            <p className="mt-1 text-sm text-red-500">{slugError}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            URL에 사용될 고유 식별자입니다. 영문 소문자, 숫자, 하이픈(-)만 사용 가능합니다.
            <br />
            예시: /resources/<span className="font-medium text-blue-600">{formData.slug || "tax-guide-2024"}</span>
          </p>
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

        {/* 현재 파일 목록 */}
        {existingFiles.length > 0 && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              현재 파일 ({existingFiles.length}개)
            </label>
            <div className="space-y-2">
              {existingFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded border"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.originalFilename}
                    </p>
                    <p className="text-xs text-gray-500">
                      {file.fileType} | {formatFileSize(file.fileSize)} |
                      다운로드: {file.downloadCount}회
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      type="button"
                      onClick={() => handleDownload(file.id)}
                      className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      다운로드
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteExistingFile(file.id)}
                      className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 파일 추가 */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            파일 추가 (여러 파일 선택 가능)
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

          {newFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-gray-700">
                추가할 파일 ({newFiles.length}개)
              </p>
              {newFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-200"
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
                    onClick={() => handleRemoveNewFile(index)}
                    className="ml-4 text-red-600 hover:text-red-800 text-sm"
                  >
                    취소
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
                <p className="font-medium">총 다운로드</p>
                <p>
                  {existingFiles.reduce((sum, f) => sum + f.downloadCount, 0) +
                    resource.downloadCount}
                  회
                </p>
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
