import Link from 'next/link'
import { FileText, Download, BookOpen, HelpCircle, ArrowLeft } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb"
import PageHeader from "@/presentation/components/common/PageHeader"
import { getContainer } from '@/infrastructure/config/getContainer';

const resourceTypeGroups = {
  'guide': { title: '신고 가이드', icon: FileText },
  'form': { title: '신고 서식', icon: BookOpen },
  'education': { title: '교육 자료', icon: BookOpen }
};

// Force dynamic rendering to ensure DB queries run at runtime
export const dynamic = "force-dynamic";

const faqs = [
  {
    question: '종교인 소득과 근로소득의 차이점은 무엇인가요?',
    answer: '종교인 소득은 종교 활동의 대가로 받는 소득으로, 근로소득보다 필요경비 인정 범위가 넓습니다.'
  },
  {
    question: '비과세 대상 소득에는 어떤 것들이 있나요?',
    answer: '사택 제공 이익, 종교 활동비, 도서비 등이 일정 한도 내에서 비과세됩니다.'
  },
  {
    question: '원천징수를 하지 않아도 되는 경우가 있나요?',
    answer: '월 소득이 일정 금액 이하인 경우 원천징수 의무가 없을 수 있습니다.'
  }
];

export default async function ReligiousIncomePage() {
  const container = getContainer();
  const categoryRepo = container.getResourceCategoryRepository();
  const resourceRepo = container.getResourceRepository();

  // Get category by slug
  let category = null;
  let resources = [];

  // Skip database queries during build
  if (process.env.SKIP_DB_QUERIES !== "true") {
    try {
      category = await categoryRepo.findBySlug('religious-income');

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
          { label: "종교인소득" }
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
        title="종교인소득 자료실"
        description="종교인 소득세 신고와 관련된 각종 가이드, 서식, 교육 자료를 제공합니다."
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

      {/* FAQ 섹션 */}
      <div className="bg-blue-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <HelpCircle className="h-6 w-6" />
          자주 묻는 질문
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg p-6">
              <h3 className="font-semibold mb-2">Q. {faq.question}</h3>
              <p className="text-gray-700">A. {faq.answer}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/consultation/faq"
            className="text-primary hover:text-primary/80 font-medium"
          >
            더 많은 FAQ 보기 →
          </Link>
        </div>
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