import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb";
import PageHeader from "@/presentation/components/common/PageHeader";
import { getContainer } from "@/infrastructure/config/getContainer";
import { notFound } from "next/navigation";

// Force dynamic rendering to ensure DB queries run at runtime
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    slug: string;
    resourceSlug: string;
  }>;
}

export default async function ResourceDetailPage({ params }: PageProps) {
  const { slug: categorySlug, resourceSlug } = await params;

  const container = getContainer();
  const resourceRepo = container.getResourceRepository();

  let resource = null;

  // Skip database queries during build
  if (process.env.SKIP_DB_QUERIES !== "true") {
    try {
      resource = await resourceRepo.findBySlug(resourceSlug, categorySlug);
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
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">

        <PageHeader
          title={<></>}
          description=""
          backgroundImage={`/menu-header/header-bg-resources-${resource.category.slug}.webp`}
          overlayColor="#00357f"
          overlayOpacity={0}
        >
          <Breadcrumb
            items={[{ label: "자료실" }, {
              label: resource.category.name,
              href: `/resources/${resource.category.slug}`,
            },
            { label: resource.title }
            ]}
            variant="light"
          />
        </PageHeader>



        {/* 게시물 본문 */}
        <article className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* 헤더 */}
          <div className="px-6 md:px-10 pt-8 pb-6 border-b border-gray-100">
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="inline-block px-3 py-1.5 text-xs font-medium bg-[#00357f]/10 text-[#00357f] rounded-md">
                {resource.category.name}
              </span>
              {resource.resourceTypes && resource.resourceTypes.length > 0 && (
                <>
                  <span className="text-gray-300">|</span>
                  {resource.resourceTypes.map((type: { id: number; name: string; code: string }) => (
                    <span
                      key={type.id}
                      className="inline-block px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-md"
                    >
                      {type.name}
                    </span>
                  ))}
                </>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5 leading-tight">
              {resource.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(resource.publishedAt || resource.createdAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {resource.viewCount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* 내용 */}
          <div className="px-6 md:px-10 py-8">
            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-[#00357f] prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: processedDescription || '' }}
            />
          </div>

          {/* 메인 컨텐츠 */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-none">
              <CardContent className="p-8">
                {/* 다운로드/외부링크 버튼 */}
                <div className="mt-8 pt-6 border-t">
                  {/* 다중 파일 목록 (resource_files 테이블) */}
                  {resource.files && resource.files.length > 0 ? (
                    <div className="p-4 bg-gray-50 rounded">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        파일 목록 ({resource.files.length}개)
                      </label>
                      <div className="space-y-2">
                        {resource.files.map((file: { id: number; originalFilename: string; fileType: string; fileSize: number }) => (
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
        </article>
      </div>
    </main >
  );
}
