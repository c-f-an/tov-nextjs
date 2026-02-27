'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/presentation/contexts/AuthContext';
import { formatDate, formatDateTime } from '@/lib/utils/date';

interface ConsultationDetail {
  id: number;
  name: string;
  namePublic: boolean;
  phone: string;
  phonePublic: boolean;
  email: string | null;
  churchName: string | null;
  churchPublic: boolean;
  position: string | null;
  positionCode: number | null;
  consultationType: string;
  inquiryCategory: number | null;
  categoryDetail: string | null;
  preferredDate: string | null;
  preferredTime: string | null;
  title: string;
  content: string;
  status: string;
  consultationDate: string | null;
  consultationNotes: string | null;
  createdAt: string;
}

interface ConsultationResponse {
  id: number;
  responseType: number;
  content: string;
  responderName: string | null;
  responderId: number | null;
  isPublic: boolean;
  createdAt: string;
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

const positionCodeLabels: Record<number, string> = {
  1: '위임목사(담임목사)',
  2: '부목사',
  3: '전도사(강도사)',
  4: '사모(목회자가족)',
  5: '장로',
  6: '권사',
  7: '집사',
  8: '재정담당자',
  99: '기타',
};

const timeLabels: Record<string, string> = {
  'morning': '오전 (09:00-12:00)',
  'afternoon': '오후 (13:00-18:00)',
  'evening': '저녁 (18:00-20:00)',
};

const responseTypeLabels: Record<number, string> = {
  1: '답변',
  2: '전문가/기관 연결',
  3: '추가 확인 후 재답변',
  4: '추가 질문',
};

const ACTIVE_STATUSES = ['pending', 'assigned', 'in_progress'];

export default function ConsultationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: consultationId } = use(params);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [consultation, setConsultation] = useState<ConsultationDetail | null>(null);
  const [responses, setResponses] = useState<ConsultationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // 추가 질문 폼
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionContent, setQuestionContent] = useState('');
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);

  useEffect(() => {
    if (!authLoading && user && consultationId) {
      fetchConsultation();
      fetchResponses();
    } else if (!authLoading && !user) {
      setIsLoading(false);
    }
  }, [authLoading, user, consultationId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchConsultation = async () => {
    try {
      const response = await fetch(`/api/consultations/${consultationId}`);
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error(`[Consultation] GET /api/consultations/${consultationId} → ${response.status}`, errData);
        if (response.status === 404) {
          setFetchError('존재하지 않는 상담이거나 접근 권한이 없습니다.');
          return;
        }
        setFetchError(errData.error || `오류가 발생했습니다. (${response.status})`);
        return;
      }
      const data = await response.json();
      setConsultation(data);
    } catch (error) {
      console.error('Error fetching consultation:', error);
      setFetchError('네트워크 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchResponses = async () => {
    try {
      const response = await fetch(`/api/consultations/${consultationId}/responses`);
      if (!response.ok) return;
      const data = await response.json();
      // 사용자에게는 공개(is_public=true)인 항목만 표시
      setResponses(data.filter((r: ConsultationResponse) => r.isPublic));
    } catch (error) {
      console.error('Error fetching responses:', error);
    }
  };

  const handleCancel = async () => {
    if (!confirm('상담 신청을 취소하시겠습니까? 취소 후에는 되돌릴 수 없습니다.')) return;

    setIsCancelling(true);
    try {
      const response = await fetch(`/api/consultations/${consultationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (!response.ok) throw new Error('Failed to cancel consultation');

      await fetchConsultation();
    } catch (error) {
      console.error('Error cancelling consultation:', error);
      alert('상담 취소에 실패했습니다.');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleAddQuestion = async () => {
    if (!questionContent.trim()) {
      alert('질문 내용을 입력해주세요.');
      return;
    }

    setIsSubmittingQuestion(true);
    try {
      const response = await fetch(`/api/consultations/${consultationId}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responseType: 4, // QUESTION
          content: questionContent,
          isPublic: true,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || '질문 등록에 실패했습니다.');
      }

      setQuestionContent('');
      setShowQuestionForm(false);
      fetchResponses();
    } catch (error) {
      console.error('Error adding question:', error);
      const message = error instanceof Error ? error.message : '질문 등록에 실패했습니다.';
      alert(message);
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  // responderId 기반으로 내 메시지인지 판별
  const isMyMessage = (resp: ConsultationResponse) => {
    if (!user) return false;
    return resp.responderId === Number(user.id);
  };

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

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

  if (fetchError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{fetchError}</p>
          <Link href="/consultation/list" className="inline-block px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  if (!consultation) return null;

  const isActive = ACTIVE_STATUSES.includes(consultation.status);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li><Link href="/" className="hover:text-blue-600">홈</Link></li>
          <li><span className="mx-2">/</span></li>
          <li><Link href="/consultation" className="hover:text-blue-600">상담센터</Link></li>
          <li><span className="mx-2">/</span></li>
          <li><Link href="/consultation/list" className="hover:text-blue-600">내 상담 목록</Link></li>
          <li><span className="mx-2">/</span></li>
          <li className="text-gray-900 font-medium">상담 상세</li>
        </ol>
      </nav>

      <div className="mx-auto space-y-6">
        {/* 상담 상세 카드 */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="border-b px-6 py-4">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="text-2xl font-bold">{consultation.title}</h1>
              <span className={`shrink-0 inline-flex px-3 py-1 text-sm font-medium rounded-full ${statusLabels[consultation.status]?.color}`}>
                {statusLabels[consultation.status]?.label}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-gray-500">
              <span>신청일: {formatDateTime(consultation.createdAt)}</span>
              {consultation.inquiryCategory && (
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                  {inquiryCategoryLabels[consultation.inquiryCategory]}
                </span>
              )}
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* 신청자 정보 */}
            <div>
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
                {consultation.positionCode && (
                  <div>
                    <span className="font-medium text-gray-700">직분:</span>
                    <span className="ml-2">{positionCodeLabels[consultation.positionCode] || String(consultation.positionCode)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 상담 정보 */}
            <div>
              <h3 className="text-lg font-semibold mb-4">상담 정보</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700">상담 분야:</span>
                  <span className="ml-2">
                    {consultationTypeLabels[consultation.consultationType] || consultation.consultationType}
                  </span>
                </div>
                {consultation.inquiryCategory && (
                  <div>
                    <span className="font-medium text-gray-700">문의 분류:</span>
                    <span className="ml-2">
                      {inquiryCategoryLabels[consultation.inquiryCategory]}
                      {consultation.inquiryCategory === 99 && consultation.categoryDetail && (
                        <span className="text-gray-500"> ({consultation.categoryDetail})</span>
                      )}
                    </span>
                  </div>
                )}
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

            {/* 상담 결과 (완료 시) */}
            {consultation.status === 'completed' && consultation.consultationNotes && (
              <div>
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
                <button
                  onClick={handleCancel}
                  disabled={isCancelling}
                  className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-red-300"
                >
                  {isCancelling ? '취소 중...' : '상담 취소'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 대화형 질문/답변 섹션 */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">질문 / 답변</h2>
            {isActive && (
              <button
                onClick={() => setShowQuestionForm(!showQuestionForm)}
                className="px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded-md hover:bg-blue-700"
              >
                + 추가 질문
              </button>
            )}
          </div>

          {/* 추가 질문 폼 */}
          {showQuestionForm && (
            <div className="border-b px-6 py-4 bg-gray-50">
              <h4 className="text-sm font-semibold mb-2 text-gray-700">추가 질문 작성</h4>
              <textarea
                value={questionContent}
                onChange={(e) => setQuestionContent(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="추가로 궁금한 내용을 입력해주세요..."
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => { setShowQuestionForm(false); setQuestionContent(''); }}
                  className="px-3 py-1.5 border rounded-md text-sm hover:bg-gray-100"
                >
                  취소
                </button>
                <button
                  onClick={handleAddQuestion}
                  disabled={isSubmittingQuestion}
                  className="px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {isSubmittingQuestion ? '등록 중...' : '질문 등록'}
                </button>
              </div>
            </div>
          )}

          {/* 대화 목록 */}
          <div className="p-6 space-y-4">
            {/* 원본 질문 (항상 첫 번째) */}
            <div className="flex justify-end">
              <div className="max-w-[80%] bg-blue-50 border border-blue-200 rounded-lg rounded-tr-none p-4">
                <div className="flex items-center gap-2 mb-2 justify-end">
                  <span className="text-xs text-gray-400">{formatDate(consultation.createdAt)}</span>
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-200 text-blue-800">원본 질문</span>
                </div>
                <p className="text-sm font-semibold text-gray-800 mb-1">{consultation.title}</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{consultation.content}</p>
              </div>
            </div>

            {/* 추가 질문 및 답변 */}
            {responses.length === 0 ? (
              <div className="text-center py-6 text-gray-400 text-sm">
                아직 등록된 답변이 없습니다.
                {isActive && (
                  <p className="mt-1">추가 질문이 있으시면 위 버튼을 이용해주세요.</p>
                )}
              </div>
            ) : (
              responses.map((resp) => {
                const isMine = isMyMessage(resp);
                const isQuestion = resp.responseType === 4;
                // 내가 보낸 항목 → 오른쪽, 관리자 답변/질문 → 왼쪽
                const showRight = isMine;

                return (
                  <div key={resp.id} className={`flex ${showRight ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        showRight
                          ? 'bg-blue-50 border border-blue-200 rounded-tr-none'
                          : isQuestion
                            ? 'bg-gray-50 border border-gray-200 rounded-tl-none'
                            : 'bg-green-50 border border-green-200 rounded-tl-none'
                      }`}
                    >
                      <div className={`flex items-center gap-2 mb-2 ${showRight ? 'justify-end flex-row-reverse' : ''}`}>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          showRight
                            ? 'bg-blue-200 text-blue-800'
                            : isQuestion
                              ? 'bg-gray-200 text-gray-700'
                              : 'bg-green-100 text-green-800'
                        }`}>
                          {responseTypeLabels[resp.responseType] || '답변'}
                        </span>
                        {resp.responderName && !showRight && (
                          <span className="text-xs text-gray-500">{resp.responderName}</span>
                        )}
                        <span className="text-xs text-gray-400">{formatDate(resp.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{resp.content}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 처리 상태 안내 */}
        {consultation.status === 'pending' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
            상담 신청이 접수되었습니다. 담당자 검토 후 배정될 예정입니다.
          </div>
        )}
        {consultation.status === 'assigned' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            담당 전문가가 배정되었습니다. 곧 상담이 진행될 예정입니다.
          </div>
        )}
        {consultation.status === 'in_progress' && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-sm text-purple-800">
            상담이 진행 중입니다. 결과는 이 페이지에서 확인하실 수 있습니다.
          </div>
        )}
      </div>
    </div>
  );
}
