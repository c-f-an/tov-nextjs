'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/presentation/contexts/AuthContext';
import { formatDate } from '@/lib/utils/date';
import PageHeader from '@/presentation/components/common/PageHeader';

interface Consultation {
  id: number;
  title: string;
  consultationType: string;
  status: string;
  createdAt: string;
  preferredDate: string | null;
  preferredTime: string | null;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: '대기중', color: 'bg-yellow-100 text-yellow-800' },
  assigned: { label: '배정됨', color: 'bg-blue-100 text-blue-800' },
  in_progress: { label: '진행중', color: 'bg-purple-100 text-purple-800' },
  completed: { label: '완료', color: 'bg-green-100 text-green-800' },
  cancelled: { label: '취소', color: 'bg-gray-100 text-gray-800' }
};

const consultationTypeLabels: Record<string, string> = {
  'religious-income': '종교인 소득세',
  'nonprofit-accounting': '비영리 회계',
  'settlement-disclosure': '결산 공시',
  'general': '일반 상담',
  'other': '기타'
};

export default function ConsultationListPage() {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchConsultations();
  }, [currentPage]);

  const fetchConsultations = async () => {
    try {
      const response = await fetch(`/api/consultations?page=${currentPage}&limit=10`);
      if (!response.ok) {
        throw new Error('Failed to fetch consultations');
      }
      const data = await response.json();
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
          <Link
            href="/login"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            로그인하기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <Link href="/" className="hover:text-blue-600">홈</Link>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li>
            <Link href="/consultation" className="hover:text-blue-600">상담센터</Link>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li className="text-gray-900 font-medium">내 상담 목록</li>
        </ol>
      </nav>

      <div className="flex justify-between items-center mb-8">
        <PageHeader
          title="내 상담 목록"
          description="신청하신 상담 내역을 확인하실 수 있습니다."
          className="mb-0"
        />
        <Link
          href="/consultation/apply"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          새 상담 신청
        </Link>
      </div>

      {/* Consultation List */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">로딩 중...</p>
        </div>
      ) : consultations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-600 mb-4">신청한 상담이 없습니다.</p>
          <Link
            href="/consultation/apply"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            상담 신청하기
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    번호
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상담 분야
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    제목
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    희망일
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    신청일
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {consultations.map((consultation, index) => (
                  <tr key={consultation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {consultation.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {consultationTypeLabels[consultation.consultationType] || consultation.consultationType}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/consultation/${consultation.id}`}
                        className="text-sm text-gray-900 hover:text-blue-600 font-medium"
                      >
                        {consultation.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusLabels[consultation.status]?.color}`}>
                        {statusLabels[consultation.status]?.label || consultation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      {consultation.preferredDate ? formatDate(consultation.preferredDate) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      {formatDate(consultation.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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
                        ? 'bg-blue-600 text-white'
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
        </>
      )}
    </div>
  );
}