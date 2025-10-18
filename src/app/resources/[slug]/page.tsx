import Link from 'next/link'
import { FileText, Download, BookOpen, ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb"
import PageHeader from "@/presentation/components/common/PageHeader"
import { getContainer } from '@/infrastructure/config/getContainer';
import { notFound } from 'next/navigation';

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
  params: {
    slug: string;
  };
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
  const { slug } = params;

  const container = getContainer();
  const categoryRepo = container.getResourceCategoryRepository();
  const resourceRepo = container.getResourceRepository();

  // Get category by slug
  let category = null;
  let resources = [];

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
  const groupedResources = resources.reduce((acc: any, resource: any) => {
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
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "자료실", href: "/resources" },
          { label: category.name }
        ]}
      />
      {/* 뒤로가기 */}
      <Link
        href="/resources"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        자료실로 돌아가기
      </Link>

      <PageHeader
        title={`${category.name} 자료실`}
        description={category.description || `${category.name} 관련 자료를 제공합니다.`}
      />

      {/* 자료 목록 */}
      <div className="space-y-8 mb-12">
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
              <div key={type}>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Icon className="h-6 w-6 text-primary" />
                  {config.title}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {typeResources.map((resource: any) => (
                    <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3 mb-3">
                              <FileText className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                              <div className="flex-1">
                                <h3 className="font-bold text-lg mb-2">{resource.title}</h3>
                                {resource.description && (
                                  <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                                )}
                                <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                                  <span className="bg-gray-100 px-2 py-1 rounded">{resource.fileType}</span>
                                  <span className="bg-gray-100 px-2 py-1 rounded">{formatFileSize(resource.fileSize)}</span>
                                  <span className="bg-gray-100 px-2 py-1 rounded">업데이트: {formatDate(resource.publishedAt)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {resource.filePath || resource.externalLink ? (
                          <Link
                            href={`/api/resources/${resource.id}/download`}
                            className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                          >
                            <Download className="h-4 w-4" />
                            다운로드
                          </Link>
                        ) : (
                          <div className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-2 text-sm bg-gray-300 text-gray-600 rounded-lg cursor-not-allowed">
                            <FileText className="h-4 w-4" />
                            파일 준비중
                          </div>
                        )}
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
      <div className="mt-8 bg-gray-100 rounded-lg p-6">
        <h3 className="font-bold mb-2">추가 도움이 필요하신가요?</h3>
        <p className="text-gray-700 mb-4">
          자료실에서 찾으시는 정보가 없거나 추가 상담이 필요하신 경우,
          전문 상담사가 도와드립니다.
        </p>
        <Link
          href="/consultation"
          className="inline-block px-6 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
        >
          상담 신청하기
        </Link>
      </div>
    </div>
  )
}
