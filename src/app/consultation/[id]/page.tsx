'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/presentation/contexts/AuthContext';
import { formatDateTime } from '@/lib/utils/date';

interface ConsultationDetail {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  churchName: string | null;
  position: string | null;
  consultationType: string;
  preferredDate: string | null;
  preferredTime: string | null;
  title: string;
  content: string;
  status: string;
  consultationDate: string | null;
  consultationNotes: string | null;
  createdAt: string;
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

const timeLabels: Record<string, string> = {
  'morning': '오전 (09:00-12:00)',
  'afternoon': '오후 (13:00-18:00)',
  'evening': '저녁 (18:00-20:00)'
};

export default function ConsultationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const [consultation, setConsultation] = useState<ConsultationDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchConsultation();
    }
  }, [user]);

  const fetchConsultation = async () => {
    try {
      const response = await fetch(`/api/consultations/${params.id}`);
      if (!response.ok) {
        if (response.status === 404) {
          router.push('/consultation/list');
          return;
        }
        throw new Error('Failed to fetch consultation');
      }
      const data = await response.json();
      setConsultation(data);
    } catch (error) {
      console.error('Error fetching consultation:', error);
      router.push('/consultation/list');
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!consultation) {
    return null;
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
          <li>
            <Link href="/consultation/list" className="hover:text-blue-600">내 상담 목록</Link>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li className="text-gray-900 font-medium">상담 상세</li>
        </ol>
      </nav>

      {/* Consultation Detail */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="border-b px-6 py-4">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold">{consultation.title}</h1>
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${statusLabels[consultation.status]?.color}`}>
                {statusLabels[consultation.status]?.label}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              신청일: {formatDateTime(consultation.createdAt)}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Applicant Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">신청자 정보</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">이름:</span>
                  <span className="ml-2">{consultation.name}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">연락처:</span>
                  <span className="ml-2">{consultation.phone}</span>
                </div>
                {consultation.email && (
                  <div>
                    <span className="font-medium text-gray-700">이메일:</span>
                    <span className="ml-2">{consultation.email}</span>
                  </div>
                )}
                {consultation.churchName && (
                  <div>
                    <span className="font-medium text-gray-700">교회/단체명:</span>
                    <span className="ml-2">{consultation.churchName}</span>
                  </div>
                )}
                {consultation.position && (
                  <div>
                    <span className="font-medium text-gray-700">직책:</span>
                    <span className="ml-2">{consultation.position}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Consultation Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">상담 정보</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700">상담 분야:</span>
                  <span className="ml-2">
                    {consultationTypeLabels[consultation.consultationType] || consultation.consultationType}
                  </span>
                </div>
                {consultation.preferredDate && (
                  <div>
                    <span className="font-medium text-gray-700">희망 상담일:</span>
                    <span className="ml-2">{new Date(consultation.preferredDate).toLocaleDateString('ko-KR')}</span>
                  </div>
                )}
                {consultation.preferredTime && (
                  <div>
                    <span className="font-medium text-gray-700">희망 시간대:</span>
                    <span className="ml-2">{timeLabels[consultation.preferredTime] || consultation.preferredTime}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Consultation Content */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">상담 내용</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="whitespace-pre-wrap text-gray-700">{consultation.content}</p>
              </div>
            </div>

            {/* Consultation Result */}
            {consultation.status === 'completed' && consultation.consultationNotes && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">상담 결과</h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  {consultation.consultationDate && (
                    <p className="text-sm text-blue-600 mb-2">
                      상담일: {formatDateTime(consultation.consultationDate)}
                    </p>
                  )}
                  <p className="whitespace-pre-wrap text-gray-700">{consultation.consultationNotes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4">
            <div className="flex justify-between items-center">
              <Link
                href="/consultation/list"
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                목록으로
              </Link>
              {consultation.status === 'pending' && (
                <button className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700">
                  상담 취소
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}