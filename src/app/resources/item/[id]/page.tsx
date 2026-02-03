import Link from "next/link";
import {
  FileText,
  Download,
  ArrowLeft,
  Calendar,
  Tag,
  HardDrive,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb";
import PageHeader from "@/presentation/components/common/PageHeader";
import { getContainer } from "@/infrastructure/config/getContainer";
import { notFound } from "next/navigation";

// Force dynamic rendering to ensure DB queries run at runtime
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ResourceDetailPage({ params }: PageProps) {
  const { id } = await params;

  const container = getContainer();
  const resourceRepo = container.getResourceRepository();

  let resource = null;

  // Skip database queries during build
  if (process.env.SKIP_DB_QUERIES !== "true") {
    try {
      resource = await resourceRepo.findById(parseInt(id));
    } catch (error) {
      console.error("Error fetching resource:", error);
    }
  }

  // If no resource found or not active, show 404
  if (!resource || !resource.isActive) {
    notFound();
  }

  let youtubeId = null;
  if (resource.externalLink) {
    if (resource.externalLink.startsWith("https://www.youtube.com/")) {
      try {
        const urlObj = new URL(resource.externalLink);
        youtubeId = urlObj.searchParams.get("v");
      } catch (e) {
        console.error("Invalid YouTube URL:", e);
      }
    } else if (resource.externalLink.startsWith("https://youtu.be/")) {
      try {
        const urlObj = new URL(resource.externalLink);
        youtubeId = urlObj.searchParams.get("v");
      } catch (e) {
        console.error("Invalid YouTube URL:", e);
      }
    }
  }

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "N/A";
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const resourceTypeLabels: { [key: string]: string } = {
    guide: "가이드",
    form: "서식",
    education: "교육 자료",
    law: "법령 자료",
    etc: "기타 자료",
  };

  // HTML 엔티티 디코딩 (이중 인코딩된 경우 처리)
  const decodeHtmlEntities = (html: string) => {
    return html
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ');
  };

  // description에서 이중 인코딩된 HTML 처리
  const processedDescription = resource.description
    ? decodeHtmlEntities(resource.description)
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "자료실", href: "/resources" },
          ...(resource.category
            ? [
                {
                  label: resource.category.name,
                  href: `/resources/${resource.category.slug}`,
                },
              ]
            : []),
          { label: resource.title },
        ]}
      />

      {/* 뒤로가기 */}
      <Link
        href={
          resource.category
            ? `/resources/${resource.category.slug}`
            : "/resources"
        }
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        {resource.category
          ? `${resource.category.name} 자료로 돌아가기`
          : "자료실로 돌아가기"}
      </Link>

      <PageHeader title={resource.title} />

      <div className="grid lg:grid-cols-3 gap-8">
        {/* 메인 컨텐츠 */}
        <div className="lg:col-span-3">
          <Card className="border-0 shadow-none">
            <CardContent className="p-8">
              {/* 상세 설명 */}
              {processedDescription && (
                <div className="prose max-w-none prose-p:break-words prose-a:break-all">
                  <div
                    className="text-gray-700 leading-relaxed break-words overflow-hidden [&_*]:max-w-full [&_img]:h-auto [&_table]:w-full [&_table]:overflow-x-auto [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: processedDescription }}
                  />
                </div>
              )}

              {/* 다운로드/외부링크 버튼 */}
              <div className="mt-8 pt-6 border-t">
                {/* 다중 파일 목록 (resource_files 테이블) */}
                {resource.files && resource.files.length > 0 ? (
                  <div className="p-4 bg-gray-50 rounded">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      파일 목록 ({resource.files.length}개)
                    </label>
                    <div className="space-y-2">
                      {resource.files.map((file: any) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 bg-white rounded border"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {file.originalFilename}
                            </p>
                            <p className="text-xs text-gray-500">
                              {file.fileType} | {formatFileSize(file.fileSize)}
                            </p>
                          </div>
                          <Link
                            href={`/api/resources/${resource.id}/download?fileId=${file.id}`}
                            className="ml-4 text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                          >
                            다운로드
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : resource.filePath ? (
                  // 하위 호환: 기존 단일 파일 표시
                  <div className="p-4 bg-gray-50 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        파일 정보
                      </label>
                      <Link
                        href={`/api/resources/${resource.id}/download`}
                        className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        다운로드
                      </Link>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>
                        파일명: {resource.originalFilename || resource.title}
                      </p>
                      <p>파일 타입: {resource.fileType || "N/A"}</p>
                      <p>파일 크기: {formatFileSize(resource.fileSize)}</p>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                {resource.externalLink ? (
                  <div className="p-4 bg-gray-50 rounded">
                    {youtubeId ? (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          관련 영상
                        </label>
                        <div className="aspect-video max-w-2xl">
                          <iframe
                            className="w-full h-full rounded-lg shadow-sm"
                            src={`https://www.youtube.com/embed/${youtubeId}`}
                            title={
                              resource.externalLinkTitle ||
                              "YouTube video player"
                            }
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                          ></iframe>
                        </div>
                        <p className="text-sm text-gray-600">
                          {resource.externalLinkTitle || "YouTube 영상"}
                        </p>
                      </div>
                    ) : (
                      <Link
                        href={resource.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-blue-700"
                      >
                        {resource.externalLinkTitle || "외부 링크 이동"}
                      </Link>
                    )}
                  </div>
                ) : (
                  <></>
                )}

                {(!resource.files || resource.files.length === 0) &&
                !resource.filePath &&
                !resource.externalLink ? (
                  <div className="p-4 bg-gray-50 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        파일 정보
                      </label>
                      <div className="text-sm bg-gray-300 text-gray-600 px-3 py-1 rounded cursor-not-allowed">
                        파일 준비중
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>파일이 아직 업로드되지 않았습니다.</p>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
