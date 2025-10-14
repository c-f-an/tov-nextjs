import Link from 'next/link'
import { FileText, Download, BookOpen, CheckCircle, ArrowLeft, ClipboardList } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb"
import PageHeader from "@/presentation/components/common/PageHeader"
import { getContainer } from '@/infrastructure/config/getContainer';

const resourceTypeGroups = {
  'guide': { title: '결산 가이드', icon: FileText },
  'form': { title: '결산 서식', icon: ClipboardList },
  'education': { title: '교육 자료', icon: BookOpen },
  'etc': { title: '기타 자료', icon: FileText }
};

// Force dynamic rendering to ensure DB queries run at runtime
export const dynamic = "force-dynamic";

export default async function SettlementPage() {
  const container = getContainer();
  const categoryRepo = container.getResourceCategoryRepository();
  const resourceRepo = container.getResourceRepository();

  // Get category by slug
  let category = null;
  let resources = [];

  // Skip database queries during build
  if (process.env.SKIP_DB_QUERIES !== "true") {
    try {
      category = await categoryRepo.findBySlug('settlement');

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
          { label: "결산공시" }
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
        title="결산공시 자료실"
        description="교회 결산 절차와 공시 의무 이행을 위한 실무 가이드와 서식을 제공합니다."
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

      {/* 결산 체크리스트 */}
      <div className="bg-green-50 rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-green-600" />
          교회 결산 체크리스트
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 bg-white rounded-lg p-4">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">회계장부 마감</h4>
              <p className="text-sm text-gray-600">수입/지출 내역 정리 및 계정과목별 집계</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white rounded-lg p-4">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">재무제표 작성</h4>
              <p className="text-sm text-gray-600">재무상태표, 운영성과표, 현금흐름표 작성</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white rounded-lg p-4">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">감사 실시</h4>
              <p className="text-sm text-gray-600">내부 감사 또는 외부 감사인 감사</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white rounded-lg p-4">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">공시 의무 이행</h4>
              <p className="text-sm text-gray-600">국세청 공익법인 공시 시스템 등록</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white rounded-lg p-4">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">총회 보고</h4>
              <p className="text-sm text-gray-600">재정 결산 보고서 작성 및 승인</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white rounded-lg p-4">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">자료 보관</h4>
              <p className="text-sm text-gray-600">회계 증빙 서류 5년 이상 보관</p>
            </div>
          </div>
        </div>
      </div>

      {/* 공시 일정 안내 */}
      <div className="bg-yellow-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">주요 공시 일정</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 bg-white rounded-lg p-4">
            <div className="w-20 text-center">
              <div className="text-2xl font-bold text-yellow-600">3월</div>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">결산서류 등 공시</h4>
              <p className="text-sm text-gray-600">전년도 결산서류를 국세청 홈택스에 공시</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white rounded-lg p-4">
            <div className="w-20 text-center">
              <div className="text-2xl font-bold text-yellow-600">4월</div>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">출연재산 보고</h4>
              <p className="text-sm text-gray-600">기부금 모금액 및 활용실적 제출</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white rounded-lg p-4">
            <div className="w-20 text-center">
              <div className="text-2xl font-bold text-yellow-600">6월</div>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">공익법인 세무확인</h4>
              <p className="text-sm text-gray-600">결산서류 공시의무 이행여부 확인</p>
            </div>
          </div>
        </div>
      </div>

      {/* 추가 안내 */}
      <div className="mt-8 bg-gray-100 rounded-lg p-6">
        <h3 className="font-bold mb-2">결산 실무 지원이 필요하신가요?</h3>
        <p className="text-gray-700 mb-4">
          교회 결산과 공시 실무에 대한 전문가 컨설팅을 제공합니다.
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