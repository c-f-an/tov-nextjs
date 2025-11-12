'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ConsultationDetailModal } from '@/presentation/components/admin/ConsultationDetailModal';
import { formatDate } from '@/lib/utils/date';

interface Consultation {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  consultationType: string;
  title: string;
  status: string;
  preferredDate: string | null;
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

export default function AdminConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedConsultationId, setSelectedConsultationId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchConsultations();
  }, [currentPage, selectedStatus]);

  const fetchConsultations = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20'
      });
      
      if (selectedStatus) {
        params.append('status', selectedStatus);
      }

      const response = await fetch(`/api/consultations?${params}`);
      if (!response.ok) throw new Error('Failed to fetch consultations');

      const data = await response.json();
      setConsultations(data.consultations);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching consultations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (consultationId: number, newStatus: string) => {
    if (!confirm('상담 상태를 변경하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/consultations/${consultationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update status');

      alert('상태가 변경되었습니다.');
      fetchConsultations();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('상태 변경에 실패했습니다.');
    }
  };

  const openDetailModal = (consultationId: number) => {
    setSelectedConsultationId(consultationId);
    setIsModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsModalOpen(false);
    setSelectedConsultationId(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">상담 관리</h1>
        <div className="flex space-x-2">
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
            대기중: {consultations.filter(c => c.status === 'pending').length}
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
            진행중: {consultations.filter(c => c.status === 'in_progress').length}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">전체 상태</option>
            <option value="pending">대기중</option>
            <option value="assigned">배정됨</option>
            <option value="in_progress">진행중</option>
            <option value="completed">완료</option>
            <option value="cancelled">취소</option>
          </select>
          <input
            type="date"
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="시작일"
          />
          <input
            type="date"
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="종료일"
          />
          <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
            필터 적용
          </button>
        </div>
      </div>

      {/* Consultations Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  신청자
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
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {consultations.map((consultation) => (
                <tr key={consultation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{consultation.name}</div>
                      <div className="text-sm text-gray-500">{consultation.phone}</div>
                      {consultation.email && (
                        <div className="text-sm text-gray-500">{consultation.email}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {consultationTypeLabels[consultation.consultationType] || consultation.consultationType}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => openDetailModal(consultation.id)}
                      className="text-sm font-medium text-gray-900 hover:text-blue-600 text-left"
                    >
                      {consultation.title}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <select
                      value={consultation.status}
                      onChange={(e) => handleStatusChange(consultation.id, e.target.value)}
                      className={`text-xs font-medium rounded-full px-3 py-1 ${statusLabels[consultation.status]?.color}`}
                    >
                      <option value="pending">대기중</option>
                      <option value="assigned">배정됨</option>
                      <option value="in_progress">진행중</option>
                      <option value="completed">완료</option>
                      <option value="cancelled">취소</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-500">
                    {consultation.preferredDate ? formatDate(consultation.preferredDate) : '-'}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-500">
                    {formatDate(consultation.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => openDetailModal(consultation.id)}
                      className="text-gray-400 hover:text-gray-600"
                      title="상세보기"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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

      {/* Detail Modal */}
      {selectedConsultationId && (
        <ConsultationDetailModal
          consultationId={selectedConsultationId}
          isOpen={isModalOpen}
          onClose={closeDetailModal}
          onUpdate={fetchConsultations}
        />
      )}
    </div>
  );
}
