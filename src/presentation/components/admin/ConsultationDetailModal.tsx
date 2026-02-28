"use client";

import { useState, useEffect } from "react";
import { formatDate, formatDateTime } from "@/lib/utils/date";

interface ConsultationDetailModalProps {
  consultationId: number;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

interface ConsultationDetail {
  name: string;
  userId: number | null;
  phone: string;
  email: string | null;
  churchName: string | null;
  positionCode: number | null;
  consultationType: string;
  inquiryCategory: number | null;
  categoryDetail: string | null;
  preferredDate: string | null;
  preferredTime: string | null;
  title: string;
  content: string;
  consultationNotes: string | null;
  status: string;
  createdAt: string;
  consultationDate: string | null;
}

interface ConsultationResponse {
  id: number;
  responseType: number;
  content: string;
  responderName: string | null;
  isPublic: boolean;
  createdAt: string;
}

interface ConsultationFollowup {
  id: number;
  followupOrder: number;
  meetingType: number | null;
  scheduledAt: string | null;
  metAt: string | null;
  topic: string | null;
  notes: string | null;
  status: number;
  createdAt: string;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "대기중", color: "bg-yellow-100 text-yellow-800" },
  assigned: { label: "배정됨", color: "bg-blue-100 text-blue-800" },
  in_progress: { label: "진행중", color: "bg-purple-100 text-purple-800" },
  completed: { label: "완료", color: "bg-green-100 text-green-800" },
  cancelled: { label: "취소", color: "bg-gray-100 text-gray-800" },
};

const consultationTypeLabels: Record<string, string> = {
  "dispute-consultation": "재정분쟁 상담",
  "financial-management": "재정운영의 실제",
  "articles-of-incorporation": "정관과 규칙",
  "religious-income": "종교인 소득세",
  "nonprofit-accounting": "비영리 회계",
  "settlement-disclosure": "결산 공시",
  general: "일반 상담",
  other: "기타",
};

const inquiryCategoryLabels: Record<number, string> = {
  1: "P-TAX(종교인소득세)",
  2: "교회재정",
  3: "정관/규칙",
  4: "비영리회계",
  5: "결산공시",
  99: "기타",
};

const positionCodeLabels: Record<number, string> = {
  1: "위임목사(담임목사)",
  2: "부목사",
  3: "전도사(강도사)",
  4: "사모(목회자가족)",
  5: "장로",
  6: "권사",
  7: "집사",
  8: "재정담당자",
  99: "기타",
};

const responseTypeLabels: Record<number, string> = {
  1: "답변",
  2: "전문가/기관 연결",
  3: "추가 확인 후 재답변",
  4: "추가 질문",
};

// 질문 유형 여부 판별
const isQuestionType = (responseType: number) => responseType === 4;

const meetingTypeLabels: Record<number, string> = {
  1: "전화",
  2: "온라인(Zoom 등)",
  3: "방문",
  99: "기타",
};

const followupStatusLabels: Record<number, { label: string; color: string }> = {
  1: { label: "예정", color: "bg-blue-100 text-blue-800" },
  2: { label: "완료", color: "bg-green-100 text-green-800" },
  3: { label: "취소", color: "bg-gray-100 text-gray-800" },
};

type ActiveTab = "info" | "responses" | "followups";

export function ConsultationDetailModal({
  consultationId,
  isOpen,
  onClose,
  onUpdate,
}: ConsultationDetailModalProps) {
  const [consultation, setConsultation] = useState<ConsultationDetail | null>(null);
  const [responses, setResponses] = useState<ConsultationResponse[]>([]);
  const [followups, setFollowups] = useState<ConsultationFollowup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("info");

  // 상담 정보 편집
  const [editMode, setEditMode] = useState(false);
  const [memo, setMemo] = useState("");
  const [status, setStatus] = useState("");

  // 답변/질문 추가 (null=닫힘, 'question'=질문 추가, 'answer'=답변 추가)
  const [showResponseForm, setShowResponseForm] = useState<null | 'question' | 'answer'>(null);
  const [newResponse, setNewResponse] = useState({
    responseType: 1,
    content: "",
    isPublic: false,
  });
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);

  const openQuestionForm = () => {
    setNewResponse({ responseType: 4, content: "", isPublic: true });
    setShowResponseForm('question');
  };

  const openAnswerForm = () => {
    setNewResponse({ responseType: 1, content: "", isPublic: false });
    setShowResponseForm('answer');
  };

  const closeResponseForm = () => {
    setShowResponseForm(null);
    setNewResponse({ responseType: 1, content: "", isPublic: false });
  };

  // 후속 모임 추가
  const [showFollowupForm, setShowFollowupForm] = useState(false);
  const [newFollowup, setNewFollowup] = useState({
    meetingType: "" as "" | number,
    scheduledAt: "",
    topic: "",
    notes: "",
  });
  const [isSubmittingFollowup, setIsSubmittingFollowup] = useState(false);

  useEffect(() => {
    if (isOpen && consultationId) {
      fetchConsultation();
      fetchResponses();
      fetchFollowups();
    }
  }, [isOpen, consultationId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchConsultation = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/consultations/${consultationId}`);
      if (!response.ok) throw new Error("Failed to fetch consultation");

      const data = await response.json();
      setConsultation(data);
      setMemo(data.consultationNotes || "");
      setStatus(data.status);
    } catch (error) {
      console.error("Error fetching consultation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchResponses = async () => {
    try {
      const response = await fetch(`/api/consultations/${consultationId}/responses`);
      if (!response.ok) return;
      const data = await response.json();
      setResponses(data);
    } catch (error) {
      console.error("Error fetching responses:", error);
    }
  };

  const fetchFollowups = async () => {
    try {
      const response = await fetch(`/api/consultations/${consultationId}/followups`);
      if (!response.ok) return;
      const data = await response.json();
      setFollowups(data);
    } catch (error) {
      console.error("Error fetching followups:", error);
    }
  };

  const handleSaveInfo = async () => {
    try {
      const response = await fetch(`/api/consultations/${consultationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, consultationNotes: memo }),
      });

      if (!response.ok) throw new Error("Failed to update consultation");

      alert("상담 정보가 업데이트되었습니다.");
      setEditMode(false);
      fetchConsultation();
      onUpdate();
    } catch (error) {
      console.error("Error updating consultation:", error);
      alert("업데이트에 실패했습니다.");
    }
  };

  const handleAddResponse = async () => {
    if (!newResponse.content.trim()) {
      alert("답변 내용을 입력해주세요.");
      return;
    }

    setIsSubmittingResponse(true);
    try {
      const response = await fetch(`/api/consultations/${consultationId}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newResponse),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to add response");
      }

      closeResponseForm();
      fetchResponses();
    } catch (error) {
      console.error("Error adding response:", error);
      const message = error instanceof Error ? error.message : "답변 등록에 실패했습니다.";
      alert(message);
    } finally {
      setIsSubmittingResponse(false);
    }
  };

  const handleAddFollowup = async () => {
    setIsSubmittingFollowup(true);
    try {
      const response = await fetch(`/api/consultations/${consultationId}/followups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meetingType: newFollowup.meetingType || undefined,
          scheduledAt: newFollowup.scheduledAt || undefined,
          topic: newFollowup.topic || undefined,
          notes: newFollowup.notes || undefined,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to add followup");
      }

      setNewFollowup({ meetingType: "", scheduledAt: "", topic: "", notes: "" });
      setShowFollowupForm(false);
      fetchFollowups();
    } catch (error) {
      console.error("Error adding followup:", error);
      const message = error instanceof Error ? error.message : "후속 모임 등록에 실패했습니다.";
      alert(message);
    } finally {
      setIsSubmittingFollowup(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-100/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">상담 상세 정보</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        ) : consultation ? (
          <>
            {/* 탭 */}
            <div className="border-b px-6">
              <nav className="flex space-x-4">
                {(["info", "responses", "followups"] as ActiveTab[]).map((tab) => {
                  const tabLabels: Record<ActiveTab, string> = {
                    info: "상담 정보",
                    responses: `답변 (${responses.length})`,
                    followups: `후속 모임 (${followups.length})`,
                  };
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                      {tabLabels[tab]}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-6">
              {/* 탭: 상담 정보 */}
              {activeTab === "info" && (
                <div className="space-y-6">
                  {/* 신청자 기본 정보 */}
                  <div>
                    <h3 className="text-base font-semibold mb-3 text-gray-800">신청자 정보</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <InfoRow label="신청자" value={consultation.name} />
                      <InfoRow label="연락처" value={consultation.phone || "-"} />
                      <InfoRow label="이메일" value={consultation.email || "-"} />
                      {consultation.churchName && (
                        <InfoRow label="교회/단체명" value={consultation.churchName} />
                      )}
                      {consultation.positionCode && (
                        <InfoRow label="직분" value={positionCodeLabels[consultation.positionCode] || String(consultation.positionCode)} />
                      )}
                    </div>
                  </div>

                  {/* 상담 내용 */}
                  <div>
                    <h3 className="text-base font-semibold mb-3 text-gray-800">상담 내용</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">상담 분야:</span>
                        <span className="ml-2">{consultationTypeLabels[consultation.consultationType] || consultation.consultationType}</span>
                      </div>
                      {consultation.inquiryCategory && (
                        <div>
                          <span className="font-medium text-gray-600">문의 분류:</span>
                          <span className="ml-2">{inquiryCategoryLabels[consultation.inquiryCategory]}</span>
                          {consultation.inquiryCategory === 99 && consultation.categoryDetail && (
                            <span className="ml-1 text-gray-500">({consultation.categoryDetail})</span>
                          )}
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-gray-600">희망일:</span>
                        <span className="ml-2">{consultation.preferredDate ? formatDate(consultation.preferredDate) : "-"}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">희망 시간:</span>
                        <span className="ml-2">{consultation.preferredTime || "-"}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="font-medium text-sm text-gray-600 mb-1">제목</p>
                      <p className="text-gray-900">{consultation.title}</p>
                    </div>
                    <div className="mt-3">
                      <p className="font-medium text-sm text-gray-600 mb-1">내용</p>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <p className="text-gray-900 whitespace-pre-wrap text-sm">{consultation.content}</p>
                      </div>
                    </div>
                  </div>

                  {/* 관리자 설정 */}
                  <div className="border-t pt-6">
                    <h3 className="text-base font-semibold mb-4 text-gray-800">관리자 설정</h3>

                    {editMode ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
                          <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          >
                            <option value="pending">대기중</option>
                            <option value="assigned">배정됨</option>
                            <option value="in_progress">진행중</option>
                            <option value="completed">완료</option>
                            <option value="cancelled">취소</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">상담 메모/결과</label>
                          <textarea
                            value={memo}
                            onChange={(e) => setMemo(e.target.value)}
                            rows={5}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="상담 관련 메모나 결과를 입력하세요..."
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setEditMode(false);
                              setMemo(consultation.consultationNotes || "");
                              setStatus(consultation.status);
                            }}
                            className="px-4 py-2 border rounded-md hover:bg-gray-50 text-sm"
                          >
                            취소
                          </button>
                          <button
                            onClick={handleSaveInfo}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-blue-700 text-sm"
                          >
                            저장
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
                          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${statusLabels[consultation.status]?.color}`}>
                            {statusLabels[consultation.status]?.label}
                          </span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">상담 메모/결과</label>
                          <div className="p-3 bg-gray-50 rounded-md min-h-[80px]">
                            <p className="text-gray-900 whitespace-pre-wrap text-sm">
                              {consultation.consultationNotes || "메모가 없습니다."}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={() => setEditMode(true)}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-blue-700 text-sm"
                          >
                            수정
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 타임스탬프 */}
                  <div className="pt-4 border-t text-sm text-gray-500 flex justify-between">
                    <span>신청일: {formatDate(consultation.createdAt)}</span>
                    {consultation.consultationDate && (
                      <span>상담일: {formatDateTime(consultation.consultationDate)}</span>
                    )}
                  </div>
                </div>
              )}

              {/* 탭: 답변 관리 */}
              {activeTab === "responses" && (
                <div className="space-y-4">
                  {/* 헤더: 버튼 영역 */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-semibold text-gray-800">
                      질문/답변 ({responses.length})
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={openQuestionForm}
                        disabled={showResponseForm === 'question'}
                        className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 disabled:bg-gray-300"
                      >
                        + 질문 추가
                      </button>
                      <button
                        onClick={openAnswerForm}
                        disabled={showResponseForm === 'answer'}
                        className="px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                      >
                        + 답변 추가
                      </button>
                    </div>
                  </div>

                  {/* 추가 폼 */}
                  {showResponseForm && (
                    <div className={`border rounded-lg p-4 ${showResponseForm === 'question' ? 'border-gray-300 bg-gray-50' : 'border-blue-200 bg-blue-50'}`}>
                      <h4 className="text-sm font-semibold mb-3">
                        {showResponseForm === 'question' ? '추가 질문 작성' : '새 답변 작성'}
                      </h4>
                      <div className="space-y-3">
                        {showResponseForm === 'answer' && (
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">답변 유형</label>
                              <select
                                value={newResponse.responseType}
                                onChange={(e) => setNewResponse({ ...newResponse, responseType: Number(e.target.value) })}
                                className="w-full px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value={1}>답변</option>
                                <option value={2}>전문가/기관 연결</option>
                                <option value={3}>추가 확인 후 재답변</option>
                              </select>
                            </div>
                            <div className="flex items-end">
                              <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={newResponse.isPublic}
                                  onChange={(e) => setNewResponse({ ...newResponse, isPublic: e.target.checked })}
                                  className="rounded"
                                />
                                <span>신청자 공개</span>
                              </label>
                            </div>
                          </div>
                        )}
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            {showResponseForm === 'question' ? '질문 내용 *' : '답변 내용 *'}
                          </label>
                          <textarea
                            value={newResponse.content}
                            onChange={(e) => setNewResponse({ ...newResponse, content: e.target.value })}
                            rows={4}
                            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={showResponseForm === 'question' ? '추가 질문 내용을 입력하세요...' : '답변 내용을 입력하세요...'}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={closeResponseForm}
                            className="px-3 py-1.5 border rounded-md text-sm hover:bg-gray-50"
                          >
                            취소
                          </button>
                          <button
                            onClick={handleAddResponse}
                            disabled={isSubmittingResponse}
                            className="px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                          >
                            {isSubmittingResponse ? "등록 중..." : "등록"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 대화형 질문/답변 목록 */}
                  <div className="space-y-3">

                    {/* 추가 질문 및 답변 */}
                    {responses.length === 0 ? (
                      <div className="text-center py-4 text-gray-400 text-sm">아직 등록된 답변이 없습니다.</div>
                    ) : (
                      responses.map((resp) => {
                        const isQuestion = isQuestionType(resp.responseType);
                        return (
                          <div key={resp.id} className={`flex ${isQuestion ? 'justify-start' : 'justify-end'}`}>
                            <div
                              className={`max-w-[80%] rounded-lg p-4 ${isQuestion
                                ? 'bg-gray-100 border border-gray-200 rounded-tl-none'
                                : 'bg-blue-50 border border-blue-200 rounded-tr-none'
                                }`}
                            >
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${isQuestion ? 'bg-gray-300 text-gray-700' : 'bg-green-100 text-green-800'
                                  }`}>
                                  {responseTypeLabels[resp.responseType] || "답변"}
                                </span>
                                {!isQuestion && (
                                  resp.isPublic ? (
                                    <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">공개</span>
                                  ) : (
                                    <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-500">비공개</span>
                                  )
                                )}
                                {resp.responderName && (
                                  <span className="text-xs text-gray-500">{resp.responderName}</span>
                                )}
                                <span className="text-xs text-gray-400 ml-auto">{formatDate(resp.createdAt)}</span>
                              </div>
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">{resp.content}</p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* 탭: 후속 모임 관리 */}
              {activeTab === "followups" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-semibold text-gray-800">후속 모임 목록</h3>
                    <button
                      onClick={() => setShowFollowupForm(!showFollowupForm)}
                      className="px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded-md hover:bg-blue-700"
                    >
                      + 후속 모임 추가
                    </button>
                  </div>

                  {/* 후속 모임 추가 폼 */}
                  {showFollowupForm && (
                    <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                      <h4 className="text-sm font-semibold mb-3">후속 모임 등록</h4>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">모임 방식</label>
                            <select
                              value={newFollowup.meetingType}
                              onChange={(e) => setNewFollowup({ ...newFollowup, meetingType: e.target.value ? Number(e.target.value) : "" })}
                              className="w-full px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">선택해주세요</option>
                              <option value={1}>전화</option>
                              <option value={2}>온라인(Zoom 등)</option>
                              <option value={3}>방문</option>
                              <option value={99}>기타</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">예정 일시</label>
                            <input
                              type="datetime-local"
                              value={newFollowup.scheduledAt}
                              onChange={(e) => setNewFollowup({ ...newFollowup, scheduledAt: e.target.value })}
                              className="w-full px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">주제</label>
                          <input
                            type="text"
                            value={newFollowup.topic}
                            onChange={(e) => setNewFollowup({ ...newFollowup, topic: e.target.value })}
                            className="w-full px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="후속 모임 주제를 입력하세요"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">내용/결과</label>
                          <textarea
                            value={newFollowup.notes}
                            onChange={(e) => setNewFollowup({ ...newFollowup, notes: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="후속 모임 내용이나 결과를 입력하세요"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => { setShowFollowupForm(false); setNewFollowup({ meetingType: "", scheduledAt: "", topic: "", notes: "" }); }}
                            className="px-3 py-1.5 border rounded-md text-sm hover:bg-gray-50"
                          >
                            취소
                          </button>
                          <button
                            onClick={handleAddFollowup}
                            disabled={isSubmittingFollowup}
                            className="px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                          >
                            {isSubmittingFollowup ? "등록 중..." : "등록"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 후속 모임 목록 */}
                  {followups.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">등록된 후속 모임이 없습니다.</div>
                  ) : (
                    <div className="space-y-4">
                      {followups.map((followup) => (
                        <div key={followup.id} className="border rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-gray-700">
                              {followup.followupOrder}차 후속 모임
                            </span>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${followupStatusLabels[followup.status]?.color}`}>
                              {followupStatusLabels[followup.status]?.label}
                            </span>
                            {followup.meetingType && (
                              <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                                {meetingTypeLabels[followup.meetingType]}
                              </span>
                            )}
                          </div>
                          {followup.topic && (
                            <p className="text-sm font-medium mb-1">{followup.topic}</p>
                          )}
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-2">
                            {followup.scheduledAt && (
                              <span>예정: {formatDateTime(followup.scheduledAt)}</span>
                            )}
                            {followup.metAt && (
                              <span>실제: {formatDateTime(followup.metAt)}</span>
                            )}
                          </div>
                          {followup.notes && (
                            <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 rounded p-2">
                              {followup.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500">상담 정보를 불러올 수 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-medium text-gray-600">{label}:</span>
      <span className="ml-2 text-gray-900">{value}</span>
    </div>
  );
}
