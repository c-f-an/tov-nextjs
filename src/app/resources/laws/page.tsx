import Link from 'next/link'
import { FileText, Download, Scale, BookOpen, ArrowLeft, ExternalLink, AlertCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb"
import PageHeader from "@/presentation/components/common/PageHeader"
import { getContainer } from '@/infrastructure/config/getContainer';

const resourceTypeGroups = {
  'law': { title: '법령 자료', icon: Scale },
  'guide': { title: '법령 해석 가이드', icon: FileText },
  'form': { title: '관련 서식', icon: BookOpen },
  'education': { title: '교육 자료', icon: BookOpen },
  'etc': { title: '기타 자료', icon: FileText }
};

const recentUpdates = [
  {
    date: '2024.01.15',
    title: '종교인소득 비과세 한도 상향 조정',
    description: '사택제공 이익 비과세 한도가 월 50만원에서 60만원으로 상향'
  },
  {
    date: '2024.01.01',
    title: '공익법인 결산서류 공시 의무 강화',
    description: '공시 대상 법인 기준 변경 및 공시 서류 범위 확대'
  },
  {
    date: '2023.12.20',
    title: '종교법인 수익사업 판정 기준 명확화',
    description: '부대사업과 수익사업의 구분 기준 상세화'
  }
];

export default async function LawsPage() {
  const container = getContainer();
  const categoryRepo = container.getResourceCategoryRepository();
  const resourceRepo = container.getResourceRepository();

  // Get category by slug
  let category = null;
  let resources = [];

  try {
    category = await categoryRepo.findBySlug('laws');

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
          { label: "관계법령" }
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
        title="관계법령 자료실"
        description="교회 세무와 관련된 주요 법령 정보와 최신 개정사항을 제공합니다."
      />

      {/* 최신 개정사항 알림 */}
      <Card className="mb-8 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <AlertCircle className="h-5 w-5" />
            최신 법령 개정사항
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentUpdates.map((update, index) => (
              <div key={index} className="border-l-4 border-blue-400 pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-blue-700">{update.date}</span>
                  <h4 className="font-semibold">{update.title}</h4>
                </div>
                <p className="text-sm text-gray-700">{update.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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

      {/* 법령 카테고리 (하드코딩된 법령 링크 섹션) */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Card>
          <CardHeader className="bg-gray-50">
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              종교인 과세 특례
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">소득세법 제21조 (기타소득)</h4>
                  <p className="text-xs text-gray-600">최종 개정: 2024.01.01</p>
                </div>
                <Link href="https://www.law.go.kr" target="_blank" className="flex items-center gap-1 text-primary hover:text-primary/80">
                  <ExternalLink className="h-4 w-4" />
                  <span className="text-sm">보기</span>
                </Link>
              </div>
              <div className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">소득세법 시행령 제41조 (종교인소득)</h4>
                  <p className="text-xs text-gray-600">최종 개정: 2023.12.28</p>
                </div>
                <Link href="https://www.law.go.kr" target="_blank" className="flex items-center gap-1 text-primary hover:text-primary/80">
                  <ExternalLink className="h-4 w-4" />
                  <span className="text-sm">보기</span>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-gray-50">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              법인세법
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">법인세법 제3조 (비영리법인의 납세의무)</h4>
                  <p className="text-xs text-gray-600">최종 개정: 2024.01.01</p>
                </div>
                <Link href="https://www.law.go.kr" target="_blank" className="flex items-center gap-1 text-primary hover:text-primary/80">
                  <ExternalLink className="h-4 w-4" />
                  <span className="text-sm">보기</span>
                </Link>
              </div>
              <div className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">법인세법 시행령 제2조 (수익사업의 범위)</h4>
                  <p className="text-xs text-gray-600">최종 개정: 2023.12.20</p>
                </div>
                <Link href="https://www.law.go.kr" target="_blank" className="flex items-center gap-1 text-primary hover:text-primary/80">
                  <ExternalLink className="h-4 w-4" />
                  <span className="text-sm">보기</span>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-gray-50">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              부가가치세법
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">부가가치세법 제26조 (재화·용역의 공급에 대한 면세)</h4>
                  <p className="text-xs text-gray-600">최종 개정: 2024.01.01</p>
                </div>
                <Link href="https://www.law.go.kr" target="_blank" className="flex items-center gap-1 text-primary hover:text-primary/80">
                  <ExternalLink className="h-4 w-4" />
                  <span className="text-sm">보기</span>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-gray-50">
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              기타 관련 법령
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">상속세 및 증여세법 (공익법인)</h4>
                  <p className="text-xs text-gray-600">최종 개정: 2024.01.01</p>
                </div>
                <Link href="https://www.law.go.kr" target="_blank" className="flex items-center gap-1 text-primary hover:text-primary/80">
                  <ExternalLink className="h-4 w-4" />
                  <span className="text-sm">보기</span>
                </Link>
              </div>
              <div className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">국세기본법 (가산세 및 처벌규정)</h4>
                  <p className="text-xs text-gray-600">최종 개정: 2023.12.30</p>
                </div>
                <Link href="https://www.law.go.kr" target="_blank" className="flex items-center gap-1 text-primary hover:text-primary/80">
                  <ExternalLink className="h-4 w-4" />
                  <span className="text-sm">보기</span>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 법령 해석 자료 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>주요 유권해석 및 판례</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold">종교인 소득 vs 근로소득 선택 기준</h4>
                <span className="text-sm text-gray-600">기획재정부 2023-1234</span>
              </div>
              <p className="text-sm text-gray-700">
                종교단체와 종교관련종사자 간 선택의 일치 필요성 및 변경 절차에 관한 해석
              </p>
              <Link href="https://www.law.go.kr" target="_blank" className="mt-2 text-sm text-primary hover:text-primary/80 inline-block">
                전문 보기 →
              </Link>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold">종교법인 부대사업 수익의 과세 여부</h4>
                <span className="text-sm text-gray-600">대법원 2023두12345</span>
              </div>
              <p className="text-sm text-gray-700">
                종교 목적에 직접 사용되는 부대시설 운영수익의 비과세 요건
              </p>
              <Link href="https://www.law.go.kr" target="_blank" className="mt-2 text-sm text-primary hover:text-primary/80 inline-block">
                전문 보기 →
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 법령 검색 도구 */}
      <div className="bg-gray-100 rounded-lg p-6">
        <h3 className="font-bold mb-4">법령 검색 도구</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="https://www.law.go.kr"
            target="_blank"
            className="flex items-center justify-between p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <div>
              <h4 className="font-semibold">국가법령정보센터</h4>
              <p className="text-sm text-gray-600">법령 원문 및 연혁 조회</p>
            </div>
            <ExternalLink className="h-5 w-5 text-gray-400" />
          </Link>

          <Link
            href="https://www.nts.go.kr"
            target="_blank"
            className="flex items-center justify-between p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
          >
            <div>
              <h4 className="font-semibold">국세청 법령정보</h4>
              <p className="text-sm text-gray-600">세법 해석 및 실무 지침</p>
            </div>
            <ExternalLink className="h-5 w-5 text-gray-400" />
          </Link>
        </div>
      </div>

      {/* 추가 안내 */}
      <div className="mt-8 bg-gray-100 rounded-lg p-6">
        <h3 className="font-bold mb-2">법령 해석 상담이 필요하신가요?</h3>
        <p className="text-gray-700 mb-4">
          복잡한 세법 적용과 해석에 대해 전문가가 도와드립니다.
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