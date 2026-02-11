import Link from 'next/link'
import { FileText, Download, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb"
import PageHeader from "@/presentation/components/common/PageHeader"
import { getContainer } from '@/infrastructure/config/getContainer';
import { notFound } from 'next/navigation';
import { Resource } from '@/core/domain/entities/Resource';
import { ResourceSearchForm } from '@/presentation/components/resources/ResourceSearchForm';

// Force dynamic rendering to ensure DB queries run at runtime
export const dynamic = "force-dynamic";

const ITEMS_PER_PAGE = 12;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

// Generate static params for all active categories
export async function generateStaticParams() {
  // Skip during build if SKIP_DB_QUERIES is true
  if (process.env.SKIP_DB_QUERIES === "true") {
    return [];
  }

  try {
    const container = getContainer();
    const categoryRepo = container.getResourceCategoryRepository();
    const categories = await categoryRepo.findActive();

    return categories.map((category) => ({
      slug: category.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function ResourceCategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page: pageParam, search: searchQuery } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam || '1') || 1);
  const searchTerm = searchQuery?.trim() || '';

  const container = getContainer();
  const categoryRepo = container.getResourceCategoryRepository();
  const resourceRepo = container.getResourceRepository();

  // Get category by slug
  let category = null;
  let resources: Resource[] = [];
  let totalItems = 0;
  let totalPages = 1;

  // Skip database queries during build
  if (process.env.SKIP_DB_QUERIES !== "true") {
    try {
      category = await categoryRepo.findBySlug(slug);

      // If category not found or not active, show 404
      if (!category || !category.isActive) {
        notFound();
      }

      const result = await resourceRepo.findAll(
        { categoryId: category.id, isActive: true, searchTerm: searchTerm || undefined },
        { page: currentPage, limit: ITEMS_PER_PAGE, orderBy: 'published_at', orderDirection: 'DESC' }
      );
      resources = result.items;
      totalItems = result.total;
      totalPages = result.totalPages;
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  }

  // If no category found, show 404
  if (!category) {
    notFound();
  }

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('ko-KR').replace(/\. /g, '.').replace(/\.$/, '');
  };

  // Build page URL with search params
  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    if (searchTerm) {
      params.set('search', searchTerm);
    }
    return `/resources/${slug}?${params.toString()}`;
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title={<></>}
          description=""
          backgroundImage={`/menu-header/header-bg-resources-${category.slug}.webp`}
          overlayColor="#00357f"
          overlayOpacity={0}
        >
          <Breadcrumb
            items={[{ label: "자료실" }, { label: category?.name || "" }]}
            variant="light"
          />
        </PageHeader>

        {/* 검색 영역 */}
        <div className="mb-6">
          <ResourceSearchForm categorySlug={slug} initialSearch={searchTerm} />
        </div>

        {/* 검색 결과 및 자료 개수 표시 */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {searchTerm ? (
              <>
                <span className="font-medium text-primary">&quot;{searchTerm}&quot;</span> 검색 결과:{' '}
                <span className="font-semibold text-primary">{totalItems}</span>개
              </>
            ) : (
              totalItems > 0 && (
                <>
                  총 <span className="font-semibold text-primary">{totalItems}</span>개의 자료
                </>
              )
            )}
            {totalPages > 1 && (
              <span className="ml-2">
                (페이지 {currentPage} / {totalPages})
              </span>
            )}
          </div>
        </div>

        {/* 자료 목록 */}
        <div className="mb-16">
          {resources.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                {searchTerm ? (
                  <>
                    <p className="text-gray-500 mb-2">&quot;{searchTerm}&quot;에 대한 검색 결과가 없습니다.</p>
                    <p className="text-sm text-gray-400">다른 검색어로 다시 시도해보세요.</p>
                  </>
                ) : (
                  <p className="text-gray-500">등록된 자료가 없습니다.</p>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources.map((resource: Resource) => (
                <Card key={resource.id} className="hover:shadow-lg transition-all duration-300 flex flex-col border border-gray-100 bg-white rounded-xl overflow-hidden h-full">
                  <CardContent className="p-0 flex flex-col flex-1">
                    {/* 콘텐츠 영역 */}
                    <div className="p-5 flex-1 flex flex-col">
                      {/* 카테고리 + 자료 유형 + 날짜 */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {/* 카테고리 배지 */}
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                            {category.name}
                          </span>
                          {/* 구분선 */}
                          {resource.resourceTypes && resource.resourceTypes.length > 0 && (
                            <span className="text-gray-300 text-xs">|</span>
                          )}
                          {/* 자료 유형 배지 */}
                          {resource.resourceTypes && resource.resourceTypes.length > 0 && (
                            <>
                              {resource.resourceTypes.slice(0, 2).map((t) => (
                                <span
                                  key={t.id}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600"
                                >
                                  {t.name}
                                </span>
                              ))}
                              {resource.resourceTypes.length > 2 && (
                                <span className="text-xs text-gray-400">+{resource.resourceTypes.length - 2}</span>
                              )}
                            </>
                          )}
                        </div>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {formatDate(resource.publishedAt)}
                        </span>
                      </div>

                      {/* 제목 */}
                      <Link href={`/resources/${category.slug}/${resource.slug}`} className="group block mb-2">
                        <h3 className="font-bold text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors min-h-[2.75rem]">
                          {resource.title}
                        </h3>
                      </Link>

                      {/* 설명 - 고정 높이 영역 */}
                      <div className="min-h-[2.5rem] mb-3">
                        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                          {resource.description ? resource.description.replace(/<[^>]*>/g, '') : ''}
                        </p>
                      </div>

                      {/* 파일 정보 */}
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-auto">
                        {resource.fileType && (
                          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {resource.fileType}
                          </span>
                        )}
                        {resource.fileSize && (
                          <span>{formatFileSize(resource.fileSize)}</span>
                        )}
                      </div>
                    </div>

                    {/* 다운로드 버튼 영역 */}
                    <div className="px-5 pb-5 pt-3 border-t border-gray-100 bg-gray-50/50 mt-auto">
                      {(resource.files && resource.files.length > 0) ? (
                        <div className="space-y-2">
                          {resource.files.map((file: { id: number; originalFilename: string }) => (
                            <Link
                              key={file.id}
                              href={`/api/resources/${resource.id}/download?fileId=${file.id}`}
                              className="flex items-center justify-between gap-3 w-full px-4 py-3 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-all hover:shadow-md"
                            >
                              <span className="truncate flex-1 text-left font-medium">{file.originalFilename}</span>
                              <Download className="h-4 w-4 flex-shrink-0" />
                            </Link>
                          ))}
                        </div>
                      ) : resource.filePath ? (
                        <Link
                          href={`/api/resources/${resource.id}/download`}
                          className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-all hover:shadow-md"
                        >
                          <Download className="h-4 w-4" />
                          {resource.originalFilename || '다운로드'}
                        </Link>
                      ) : resource.externalLink ? (
                        <Link
                          href={resource.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all hover:shadow-md"
                        >
                          <ExternalLink className="h-4 w-4" />
                          외부 링크 이동
                        </Link>
                      ) : (
                        <div className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed">
                          <FileText className="h-4 w-4" />
                          파일 준비중
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mb-16">
            {/* 이전 버튼 */}
            {currentPage > 1 ? (
              <Link
                href={buildPageUrl(currentPage - 1)}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                이전
              </Link>
            ) : (
              <span className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-300 bg-gray-50 border border-gray-100 rounded-lg cursor-not-allowed">
                <ChevronLeft className="h-4 w-4" />
                이전
              </span>
            )}

            {/* 페이지 번호 */}
            <div className="flex items-center gap-1">
              {getPageNumbers().map((pageNum, idx) => (
                pageNum === '...' ? (
                  <span key={`ellipsis-${idx}`} className="px-3 py-2 text-gray-400">...</span>
                ) : (
                  <Link
                    key={pageNum}
                    href={buildPageUrl(pageNum as number)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${currentPage === pageNum
                      ? 'bg-primary text-white'
                      : 'text-gray-600 bg-white border border-gray-200 hover:bg-gray-50'
                      }`}
                  >
                    {pageNum}
                  </Link>
                )
              ))}
            </div>

            {/* 다음 버튼 */}
            {currentPage < totalPages ? (
              <Link
                href={buildPageUrl(currentPage + 1)}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                다음
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <span className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-300 bg-gray-50 border border-gray-100 rounded-lg cursor-not-allowed">
                다음
                <ChevronRight className="h-4 w-4" />
              </span>
            )}
          </div>
        )}

        {/* 추가 안내 */}
        <div className="mt-12 bg-gradient-to-r from-primary/5 to-blue-50 rounded-2xl p-8 md:p-10 border border-primary/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">추가 도움이 필요하신가요?</h3>
              <p className="text-gray-600 leading-relaxed">
                자료실에서 찾으시는 정보가 없거나 추가 상담이 필요하신 경우,<br className="hidden md:block" />
                전문 상담사가 도와드립니다.
              </p>
            </div>
            <Link
              href="/consultation"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all hover:shadow-lg font-medium whitespace-nowrap"
            >
              상담 신청하기
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
