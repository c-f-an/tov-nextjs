"use client";

import { useState, useEffect } from "react";
import { formatDate } from "@/lib/utils/date";

interface ConsultationDetailModalProps {
  consultationId: number;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "대기중", color: "bg-yellow-100 text-yellow-800" },
  assigned: { label: "배정됨", color: "bg-blue-100 text-blue-800" },
  in_progress: { label: "진행중", color: "bg-purple-100 text-purple-800" },
  completed: { label: "완료", color: "bg-green-100 text-green-800" },
  cancelled: { label: "취소", color: "bg-gray-100 text-gray-800" },
};

const consultationTypeLabels: Record<string, string> = {
  "religious-income": "종교인 소득세",
  "nonprofit-accounting": "비영리 회계",
  "settlement-disclosure": "결산 공시",
  general: "일반 상담",
  other: "기타",
};

export function ConsultationDetailModal({
  consultationId,
  isOpen,
  onClose,
  onUpdate,
}: ConsultationDetailModalProps) {
  const [consultation, setConsultation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [memo, setMemo] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (isOpen && consultationId) {
      fetchConsultation();
    }
  }, [isOpen, consultationId]);

  const fetchConsultation = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/consultations/${consultationId}`);
      if (!response.ok) throw new Error("Failed to fetch consultation");

      const data = await response.json();
      setConsultation(data);
      setMemo(data.consultationNotes || data.consultationNote || "");
      setStatus(data.status);
    } catch (error) {
      console.error("Error fetching consultation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/consultations/${consultationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          consultationNote: memo,
        }),
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
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">상담 상세 정보</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        ) : consultation ? (
          <div className="p-6">
            {/* 기본 정보 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">기본 정보</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    신청자
                  </label>
                  <p className="mt-1 text-gray-900">
                    {consultation.name || consultation.userId}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    연락처
                  </label>
                  <p className="mt-1 text-gray-900">
                    {consultation.phone || "-"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    이메일
                  </label>
                  <p className="mt-1 text-gray-900">
                    {consultation.email || "-"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    상담 분야
                  </label>
                  <p className="mt-1 text-gray-900">
                    {consultationTypeLabels[consultation.type] ||
                      consultation.type}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    희망 일자
                  </label>
                  <p className="mt-1 text-gray-900">
                    {consultation.preferredDate
                      ? formatDate(consultation.preferredDate)
                      : "-"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    희망 시간
                  </label>
                  <p className="mt-1 text-gray-900">
                    {consultation.preferredTime || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* 상담 내용 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">상담 내용</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  제목
                </label>
                <p className="mt-1 text-gray-900">{consultation.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  내용
                </label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {consultation.content}
                  </p>
                </div>
              </div>
            </div>

            {/* 첨부파일 */}
            {consultation.attachments &&
              consultation.attachments.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">첨부파일</h3>
                  <div className="space-y-2">
                    {consultation.attachments.map(
                      (file: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center p-2 bg-gray-50 rounded"
                        >
                          <svg
                            className="w-5 h-5 text-gray-400 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                            />
                          </svg>
                          <span className="text-sm text-gray-700">
                            {file.name || file}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* 관리자 메모 및 상태 */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">관리자 설정</h3>

              {editMode ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      상태
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">대기중</option>
                      <option value="assigned">배정됨</option>
                      <option value="in_progress">진행중</option>
                      <option value="completed">완료</option>
                      <option value="cancelled">취소</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      관리자 메모
                    </label>
                    <textarea
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="상담 관련 메모를 입력하세요..."
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setEditMode(false);
                        setMemo(
                          consultation.consultationNotes ||
                            consultation.consultationNote ||
                            ""
                        );
                        setStatus(consultation.status);
                      }}
                      className="px-4 py-2 border rounded-md hover:bg-gray-50"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-blue-700"
                    >
                      저장
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      상태
                    </label>
                    <span
                      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                        statusLabels[consultation.status]?.color
                      }`}
                    >
                      {statusLabels[consultation.status]?.label}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      관리자 메모
                    </label>
                    <div className="p-3 bg-gray-50 rounded-md min-h-[100px]">
                      <p className="text-gray-900 whitespace-pre-wrap">
                        {consultation.consultationNotes ||
                          consultation.consultationNote ||
                          "메모가 없습니다."}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-blue-700"
                    >
                      수정
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 타임스탬프 */}
            <div className="mt-6 pt-6 border-t text-sm text-gray-500">
              <div className="flex justify-between">
                <span>신청일: {formatDate(consultation.createdAt)}</span>
                {consultation.completedAt && (
                  <span>완료일: {formatDate(consultation.completedAt)}</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500">상담 정보를 불러올 수 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
