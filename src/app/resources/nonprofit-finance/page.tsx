import Link from 'next/link'
import { FileText, Download, BookOpen, Calculator, ArrowLeft } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb"
import PageHeader from "@/presentation/components/common/PageHeader"
import { getContainer } from '@/infrastructure/config/getContainer';

const resourceTypeGroups = {
  'guide': { title: '회계 가이드', icon: FileText },
  'form': { title: '재무 서식', icon: Calculator },
  'education': { title: '교육 자료', icon: BookOpen },
  'law': { title: '관련 법규', icon: FileText },
  'etc': { title: '기타 자료', icon: FileText }
};

// Force dynamic rendering to ensure DB queries run at runtime
export const dynamic = "force-dynamic";

export default async function NonprofitFinancePage() {
  const container = getContainer();
  const categoryRepo = container.getResourceCategoryRepository();
  const resourceRepo = container.getResourceRepository();

  // Get category by slug
  let category = null;
  let resources = [];

  // Skip database queries during build
  if (process.env.SKIP_DB_QUERIES !== "true") {
    try {
      category = await categoryRepo.findBySlug('nonprofit-finance');

      if (category) {
        const result = await resourceRepo.findAll(
          { categoryId: category.id, isActive: true },
          { page: 1, limit: 100, orderBy: 'resource_type,published_at', orderDirection: 'DESC' }
        );
        resources = result.items;
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
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
          { label: "비영리재정" }
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
        title="비영리재정 자료실"
        description="비영리법인의 투명한 재정 운영을 위한 회계 기준, 재무제표 작성법, 관련 서식을 제공합니다."
      />

      {/* 자료 목록 */}
      <div className="space-y-8 mb-12">
        {Object.entries(resourceTypeGroups).map(([type, config]) => {
          const Icon = config.icon;
          const typeResources = groupedResources[type] || [];

          if (typeResources.length === 0) return null;

          return (
            <Card key={type}>
              <CardHeader className="bg-gray-50">
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  {config.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {typeResources.map((resource: any) => (
                    <div
                      key={resource.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <h4 className="font-medium">{resource.title}</h4>
                          <p className="text-sm text-gray-600">
                            {resource.fileType} • {formatFileSize(resource.fileSize)} • 업데이트: {formatDate(resource.publishedAt)}
                          </p>
                          {resource.description && (
                            <p className="text-sm text-gray-500 mt-1">{resource.description}</p>
                          )}
                        </div>
                      </div>
                      <Link
                        href={`/api/resources/${resource.id}/download`}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        다운로드
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {resources.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">등록된 자료가 없습니다.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 주요 안내사항 */}
      <div className="bg-blue-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">비영리법인 회계 핵심 사항</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">1</span>
              복식부기 원칙
            </h3>
            <p className="text-gray-700 text-sm">
              모든 거래를 차변과 대변으로 기록하여 재무상태와 운영성과를 정확히 파악해야 합니다.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">2</span>
              발생주의 회계
            </h3>
            <p className="text-gray-700 text-sm">
              현금 수수와 관계없이 거래 발생 시점을 기준으로 수익과 비용을 인식합니다.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">3</span>
              재무제표 공시
            </h3>
            <p className="text-gray-700 text-sm">
              재무상태표, 운영성과표, 현금흐름표를 작성하여 투명하게 공개해야 합니다.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">4</span>
              내부 통제
            </h3>
            <p className="text-gray-700 text-sm">
              회계 부정과 오류를 방지하기 위한 내부 통제 시스템을 구축해야 합니다.
            </p>
          </div>
        </div>
      </div>

      {/* 추가 안내 */}
      <div className="mt-8 bg-gray-100 rounded-lg p-6">
        <h3 className="font-bold mb-2">전문가 상담이 필요하신가요?</h3>
        <p className="text-gray-700 mb-4">
          비영리법인 회계 및 재정 관리에 대한 맞춤형 컨설팅을 제공합니다.
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