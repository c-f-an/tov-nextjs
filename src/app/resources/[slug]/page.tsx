import Link from 'next/link'
import { FileText, Download, BookOpen, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb"
import PageHeader from "@/presentation/components/common/PageHeader"
import { getContainer } from '@/infrastructure/config/getContainer';
import { notFound } from 'next/navigation';
import { Resource } from '@/core/domain/entities/Resource';

const resourceTypeGroups = {
  'guide': { title: '가이드', icon: FileText },
  'form': { title: '서식', icon: BookOpen },
  'education': { title: '교육 자료', icon: BookOpen },
  'law': { title: '법령 자료', icon: FileText },
  'etc': { title: '기타 자료', icon: FileText }
};

// Force dynamic rendering to ensure DB queries run at runtime
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    slug: string;
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

export default async function ResourceCategoryPage({ params }: PageProps) {
  const { slug } = await params;

  const container = getContainer();
  const categoryRepo = container.getResourceCategoryRepository();
  const resourceRepo = container.getResourceRepository();

  // Get category by slug
  let category = null;
  let resources: Resource[] = [];

  // Skip database queries during build
  if (process.env.SKIP_DB_QUERIES !== "true") {
    try {
      category = await categoryRepo.findBySlug(slug);

      // If category not found or not active, show 404
      if (!category || !category.isActive) {
        notFound();
      }

      const result = await resourceRepo.findAll(
        { categoryId: category.id, isActive: true },
        { page: 1, limit: 100, orderBy: 'resource_type,published_at', orderDirection: 'DESC' }
      );
      resources = result.items;
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  }

  // If no category found, show 404
  if (!category) {
    notFound();
  }

  // Group resources by type
  const groupedResources = resources.reduce((acc: Record<string, Resource[]>, resource: Resource) => {
    const type = resource.resourceType;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(resource);
    return acc;
  }, {});

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

        {/* 자료 목록 */}
        <div className="space-y-12 mb-16">
          {resources.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">등록된 자료가 없습니다.</p>
              </CardContent>
            </Card>
          ) : (
            Object.entries(resourceTypeGroups).map(([type, config]) => {
              const Icon = config.icon;
              const typeResources = groupedResources[type] || [];

              if (typeResources.length === 0) return null;

              return (
                <div key={type} className="mb-4">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-3 pb-3 border-b border-gray-200">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    {config.title}
                    <span className="text-sm font-normal text-gray-500 ml-auto">
                      {typeResources.length}개 자료
                    </span>
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {typeResources.map((resource: Resource) => (
                      <Card key={resource.id} className="hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-100 bg-white rounded-xl overflow-hidden">
                        <CardContent className="p-0 flex flex-col flex-1">
                          {/* 콘텐츠 영역 */}
                          <div className="p-6 flex-1">
                            <Link href={`/resources/item/${resource.id}`} className="group block">
                              <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                {resource.title}
                              </h3>
                            </Link>
                            {resource.description && (
                              <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                                {resource.description.replace(/<[^>]*>/g, '')}
                              </p>
                            )}
                            {/* 메타 정보 */}
                            <div className="flex flex-wrap gap-2 text-xs">
                              {resource.fileType && (
                                <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium">
                                  {resource.fileType}
                                </span>
                              )}
                              {resource.fileSize && (
                                <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                                  {formatFileSize(resource.fileSize)}
                                </span>
                              )}
                              {resource.publishedAt && (
                                <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                                  {formatDate(resource.publishedAt)}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* 다운로드 버튼 영역 */}
                          <div className="px-6 pb-6 pt-4 border-t border-gray-100 bg-gray-50/50">
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
                </div>
              );
            })
          )}
        </div>

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
