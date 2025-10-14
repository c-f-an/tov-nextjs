"use client";

import { useState } from "react";
import { X, UserX, AlertTriangle } from "lucide-react";

interface SuspendUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, sendEmail: boolean) => Promise<void>;
  userName?: string;
  userEmail?: string;
}

const suspendReasons = [
  "서비스 이용약관 위반",
  "부적절한 콘텐츠 게시",
  "스팸 또는 광고성 활동",
  "타 회원에 대한 욕설 또는 비방",
  "허위 정보 제공",
  "시스템 악용 또는 해킹 시도",
  "기타 (직접 입력)"
];

export function SuspendUserModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
  userEmail,
}: SuspendUserModalProps) {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    const reason = selectedReason === "기타 (직접 입력)" ? customReason : selectedReason;

    if (!reason) {
      alert("정지 사유를 선택하거나 입력해주세요.");
      return;
    }

    setIsProcessing(true);
    try {
      await onConfirm(reason, sendEmail);
      onClose();
      // Reset form
      setSelectedReason("");
      setCustomReason("");
      setSendEmail(true);
    } catch (error) {
      console.error("Error suspending user:", error);
      alert("계정 정지 처리 중 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg">
        <div className="bg-red-50 px-6 py-4 border-b border-red-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <UserX className="h-5 w-5 text-red-600 mr-2" />
              <h2 className="text-xl font-bold text-red-900">계정 정지</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Warning Message */}
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-900 mb-1">주의사항</p>
                <p className="text-yellow-800">
                  계정을 정지하면 해당 사용자는 서비스에 로그인할 수 없습니다.
                </p>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-1">대상 회원</p>
            <p className="font-medium">{userName || "회원"}</p>
            <p className="text-sm text-gray-600">{userEmail}</p>
          </div>

          {/* Suspension Reason */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              정지 사유 <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">사유를 선택하세요</option>
              {suspendReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>

            {selectedReason === "기타 (직접 입력)" && (
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                rows={3}
                className="mt-2 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="정지 사유를 입력하세요..."
              />
            )}
          </div>

          {/* Email Notification */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="mr-2 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">
                회원에게 계정 정지 안내 이메일 발송
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
              disabled={isProcessing}
            >
              취소
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                  처리 중...
                </>
              ) : (
                <>
                  <UserX className="h-4 w-4 mr-2" />
                  계정 정지
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}