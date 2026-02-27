'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/presentation/contexts/AuthContext';
import { Breadcrumb } from '@/presentation/components/common/Breadcrumb';
import PageHeader from '@/presentation/components/common/PageHeader';
import { formatDate } from '@/lib/utils/date';

interface Consultation {
  id: number;
  title: string;
  consultationType: string;
  status: string;
  preferredDate: string | null;
  createdAt: string;
  inquiryCategory: number | null;
}

interface ConsultationListResponse {
  consultations: Consultation[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: '대기중', color: 'bg-yellow-100 text-yellow-800' },
  assigned: { label: '배정됨', color: 'bg-blue-100 text-blue-800' },
  in_progress: { label: '진행중', color: 'bg-purple-100 text-purple-800' },
  completed: { label: '완료', color: 'bg-green-100 text-green-800' },
  cancelled: { label: '취소', color: 'bg-gray-100 text-gray-800' },
};

const consultationTypeLabels: Record<string, string> = {
  'dispute-consultation': '재정분쟁 상담',
  'financial-management': '재정운영의 실제',
  'articles-of-incorporation': '정관과 규칙',
  'religious-income': '종교인 소득세',
  'nonprofit-accounting': '비영리 회계',
  'settlement-disclosure': '결산 공시',
  'general': '일반 상담',
  'other': '기타',
};

const inquiryCategoryLabels: Record<number, string> = {
  1: 'P-TAX(종교인소득세)',
  2: '교회재정',
  3: '정관/규칙',
  4: '비영리회계',
  5: '결산공시',
  99: '기타',
};

export default function ConsultationListPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    if (!authLoading && user === null) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) {
      fetchConsultations();
    }
  }, [user, currentPage, selectedStatus]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchConsultations = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
      });
      if (selectedStatus) {
        params.append('status', selectedStatus);
      }

      const response = await fetch(`/api/consultations?${params}`);
      if (!response.ok) throw new Error('Failed to fetch consultations');

      const data: ConsultationListResponse = await response.json();
      setConsultations(data.consultations);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching consultations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">로그인이 필요한 서비스입니다.</p>
          <Link href="/login" className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-blue-700">
            로그인하기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title={<></>}
          description=""
          backgroundImage="/menu-header/header-bg-consultation-apply.webp"
          overlayColor="#00357f"
          overlayOpacity={0}
        >
          <Breadcrumb
            items={[{ label: '상담센터' }, { label: '내 상담 목록' }]}
            variant="light"
          />
        </PageHeader>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">내 상담 신청 목록</h2>
          <Link
            href="/consultation/apply"
            className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            새 상담 신청
          </Link>
        </div>

        {/* 상태 필터 */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setSelectedStatus(''); setCurrentPage(1); }}
              className={`px-4 py-2 text-sm rounded-full transition-colors ${
                selectedStatus === ''
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              전체
            </button>
            {Object.entries(statusLabels).map(([value, { label }]) => (
              <button
                key={value}
                onClick={() => { setSelectedStatus(value); setCurrentPage(1); }}
                className={`px-4 py-2 text-sm rounded-full transition-colors ${
                  selectedStatus === value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 목록 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-gray-500">로딩 중...</div>
          ) : consultations.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 mb-4">상담 신청 내역이 없습니다.</p>
              <Link
                href="/consultation/apply"
                className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-blue-700"
              >
                상담 신청하기
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {consultations.map((consultation) => (
                <Link
                  key={consultation.id}
                  href={`/consultation/${consultation.id}`}
                  className="block p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${statusLabels[consultation.status]?.color}`}>
                          {statusLabels[consultation.status]?.label}
                        </span>
                        {consultation.inquiryCategory && (
                          <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
                            {inquiryCategoryLabels[consultation.inquiryCategory]}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">
                          {consultationTypeLabels[consultation.consultationType] || consultation.consultationType}
                        </span>
                      </div>
                      <h3 className="text-base font-medium text-gray-900 truncate">
                        {consultation.title}
                      </h3>
                    </div>
                    <div className="text-right shrink-0 text-sm text-gray-500 space-y-1">
                      <div>신청일: {formatDate(consultation.createdAt)}</div>
                      {consultation.preferredDate && (
                        <div>희망일: {formatDate(consultation.preferredDate)}</div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
              >
                이전
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    currentPage === page
                      ? 'bg-primary text-primary-foreground'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </nav>
          </div>
        )}
      </div>
    </main>
  );
}
