import Link from 'next/link'
import { FileText, Download, ArrowLeft, Calendar, Tag, HardDrive } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Breadcrumb } from "@/presentation/components/common/Breadcrumb"
import PageHeader from "@/presentation/components/common/PageHeader"
import { getContainer } from '@/infrastructure/config/getContainer';
import { notFound } from 'next/navigation';

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
      console.error('Error fetching resource:', error);
    }
  }

  // If no resource found or not active, show 404
  if (!resource || !resource.isActive) {
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
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const resourceTypeLabels: { [key: string]: string } = {
    'guide': '가이드',
    'form': '서식',
    'education': '교육 자료',
    'law': '법령 자료',
    'etc': '기타 자료'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "자료실", href: "/resources" },
          ...(resource.category ? [{ label: resource.category.name, href: `/resources/${resource.category.slug}` }] : []),
          { label: resource.title }
        ]}
      />

      {/* 뒤로가기 */}
      <Link
        href={resource.category ? `/resources/${resource.category.slug}` : '/resources'}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        {resource.category ? `${resource.category.name} 자료로 돌아가기` : '자료실로 돌아가기'}
      </Link>

      <PageHeader
        title={resource.title}
        description={resource.description || ''}
      />

      <div className="grid lg:grid-cols-3 gap-8">
        {/* 메인 컨텐츠 */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-8">
              {/* 상세 설명 */}
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-4">자료 설명</h3>
                {resource.description ? (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{resource.description}</p>
                ) : (
                  <p className="text-gray-500">상세 설명이 없습니다.</p>
                )}
              </div>

              {/* 다운로드 버튼 */}
              <div className="mt-8 pt-6 border-t">
                {resource.filePath || resource.externalLink ? (
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
                      <p>파일명: {resource.originalFilename || resource.title}</p>
                      <p>파일 타입: {resource.fileType || 'N/A'}</p>
                      <p>파일 크기: {formatFileSize(resource.fileSize)}</p>
                    </div>
                  </div>
                ) : (
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
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 사이드바 - 자료 정보 */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">자료 정보</h3>
              <div className="space-y-4">
                {/* 카테고리 */}
                {resource.category && (
                  <div className="flex items-start gap-3">
                    <Tag className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">카테고리</p>
                      <Link
                        href={`/resources/${resource.category.slug}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {resource.category.name}
                      </Link>
                    </div>
                  </div>
                )}

                {/* 자료 유형 */}
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">자료 유형</p>
                    <p className="font-medium">{resourceTypeLabels[resource.resourceType] || resource.resourceType}</p>
                  </div>
                </div>

                {/* 파일 형식 */}
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">파일 형식</p>
                    <p className="font-medium">{resource.fileType || 'N/A'}</p>
                  </div>
                </div>

                {/* 파일 크기 */}
                <div className="flex items-start gap-3">
                  <HardDrive className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">파일 크기</p>
                    <p className="font-medium">{formatFileSize(resource.fileSize)}</p>
                  </div>
                </div>

                {/* 게시일 */}
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">게시일</p>
                    <p className="font-medium">{formatDate(resource.publishedAt)}</p>
                  </div>
                </div>

                {/* 최종 수정일 */}
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">최종 수정일</p>
                    <p className="font-medium">{formatDate(resource.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 추가 안내 */}
          <div className="mt-6 bg-gray-100 rounded-lg p-6">
            <h4 className="font-semibold mb-2">도움이 필요하신가요?</h4>
            <p className="text-sm text-gray-700 mb-4">
              자료 이용에 어려움이 있거나 추가 상담이 필요하신 경우 문의해 주세요.
            </p>
            <Link
              href="/consultation"
              className="inline-block w-full text-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors text-sm"
            >
              상담 신청하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
