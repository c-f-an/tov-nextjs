import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { FileText, Calculator, Receipt, Scale, Download } from 'lucide-react'
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb"
import PageHeader from '@/presentation/components/common/PageHeader'
import { getContainer } from '@/infrastructure/config/getContainer';

const iconMap: { [key: string]: any } = {
  'Calculator': Calculator,
  'Receipt': Receipt,
  'FileText': FileText,
  'Scale': Scale
};

// Force dynamic rendering to ensure DB queries run at runtime
export const dynamic = "force-dynamic";

const defaultCategories = [
  {
    title: '종교인소득',
    description: '종교인 소득세 관련 자료와 가이드',
    href: '/resources/religious-income',
    icon: 'Calculator',
    items: ['소득세 신고 가이드', '절세 방안', '관련 서식', 'FAQ']
  },
  {
    title: '비영리재정',
    description: '비영리법인 재정 관리 자료',
    href: '/resources/nonprofit-finance',
    icon: 'Receipt',
    items: ['회계 기준', '재무제표 작성', '내부 통제', '감사 대응']
  },
  {
    title: '결산공시',
    description: '교회 결산 및 공시 관련 자료',
    href: '/resources/settlement',
    icon: 'FileText',
    items: ['결산 절차', '공시 의무', '보고서 양식', '체크리스트']
  },
  {
    title: '관계법령',
    description: '교회 세무 관련 법령 정보',
    href: '/resources/laws',
    icon: 'Scale',
    items: ['종교인과세 특례', '법인세법', '부가가치세법', '최신 개정사항']
  }
];

export default async function ResourcesPage() {
  const container = getContainer();
  const resourceCategoryRepo = container.getResourceCategoryRepository();
  const resourceRepo = container.getResourceRepository();

  // Get categories from database
  let categories = [];
  let featuredResources = [];

  // Skip database queries during build
  if (process.env.SKIP_DB_QUERIES !== "true") {
    try {
      categories = await resourceCategoryRepo.findActive();
      const featuredResult = await resourceRepo.findAll(
        { isFeatured: true, isActive: true },
        { page: 1, limit: 5, orderBy: 'published_at', orderDirection: 'DESC' }
      );
      featuredResources = featuredResult.items;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Map categories to display format
  const resourceCategories = categories.length > 0
    ? categories.map(cat => ({
        title: cat.name,
        description: cat.description || '',
        href: `/resources/${cat.slug}`,
        icon: cat.icon || 'FileText',
        items: ['자료 보기', '다운로드', '최신 업데이트']
      }))
    : defaultCategories;

  const formatDate = (date: Date | string | null) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('ko-KR');
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: '자료실' }]} />
      <PageHeader 
        title="자료실"
        description="교회 세무와 재정 관리에 필요한 각종 자료를 제공합니다."
      />

      {/* 자료 카테고리 */}
      <div className="grid gap-6 md:grid-cols-2 mb-12">
        {resourceCategories.map((category) => {
          const Icon = iconMap[category.icon] || FileText
          return (
            <Link key={category.href} href={category.href}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{category.title}</CardTitle>
                      <CardDescription className="mb-3">
                        {category.description}
                      </CardDescription>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {category.items.map((item, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* 최신 자료 */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Download className="h-6 w-6" />
          주요 자료
        </h2>
        <div className="space-y-4">
          {featuredResources.length > 0 ? (
            featuredResources.map((resource) => (
              <div
                key={resource.id}
                className="bg-white rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-100 rounded">
                    <FileText className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{resource.title}</h3>
                    <p className="text-sm text-gray-600">
                      {resource.category?.name || ''} • {formatDate(resource.publishedAt)} • {resource.fileType}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/api/resources/${resource.id}/download`}
                  className="px-4 py-2 text-sm bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                >
                  다운로드
                </Link>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              주요 자료가 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* 안내사항 */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold mb-2">자료 이용 안내</h3>
        <ul className="text-sm space-y-1 text-gray-700">
          <li>• 모든 자료는 무료로 다운로드 가능합니다.</li>
          <li>• 자료는 교육 및 실무 목적으로만 사용해 주세요.</li>
          <li>• 최신 법령 개정사항을 반영하여 정기적으로 업데이트됩니다.</li>
          <li>• 추가 자료가 필요하신 경우 상담센터로 문의해 주세요.</li>
        </ul>
      </div>
    </div>
  )
}