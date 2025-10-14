"use client";

import { useState } from "react";
import { X, Send, AlertCircle, Users } from "lucide-react";

interface BulkEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  userIds: number[];
  userCount: number;
  onSuccess: () => void;
}

const emailTemplates = [
  { value: 'notification', label: '일반 알림' },
  { value: 'welcome', label: '환영 메일' },
  { value: 'password-reset', label: '비밀번호 재설정' },
  { value: 'custom', label: '사용자 정의' },
];

export function BulkEmailModal({
  isOpen,
  onClose,
  userIds,
  userCount,
  onSuccess,
}: BulkEmailModalProps) {
  const [template, setTemplate] = useState('notification');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!subject) {
      setError('제목을 입력해주세요.');
      return;
    }

    if (!content && template === 'custom') {
      setError('내용을 입력해주세요.');
      return;
    }

    setIsSending(true);
    setError('');

    try {
      const response = await fetch('/api/admin/users/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIds,
          template,
          subject,
          content: template === 'custom' ? content : `<p>${content}</p>`,
          title: subject,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send emails');
      }

      alert(`${userCount}명에게 이메일이 성공적으로 발송되었습니다.`);
      onSuccess();

      // Reset form
      setTemplate('notification');
      setSubject('');
      setContent('');
    } catch (error) {
      console.error('Error sending bulk emails:', error);
      setError(error instanceof Error ? error.message : '이메일 발송에 실패했습니다.');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">일괄 이메일 발송</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Recipient Info */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">받는 사람</p>
                <p className="font-medium text-blue-900">선택한 회원 {userCount}명</p>
              </div>
            </div>
          </div>

          {/* Template Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              템플릿 선택
            </label>
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {emailTemplates.map((tmpl) => (
                <option key={tmpl.value} value={tmpl.value}>
                  {tmpl.label}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="이메일 제목을 입력하세요"
            />
          </div>

          {/* Content */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내용 {template === 'custom' && <span className="text-red-500">*</span>}
            </label>
            {template === 'custom' ? (
              <div className="border rounded-md p-2">
                <div className="mb-2 text-xs text-gray-500">
                  HTML 태그를 사용할 수 있습니다. (예: &lt;p&gt;, &lt;strong&gt;, &lt;br&gt;)
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  className="w-full px-3 py-2 border-0 focus:outline-none resize-none"
                  placeholder="이메일 내용을 입력하세요..."
                />
              </div>
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="추가 메시지를 입력하세요 (선택사항)"
              />
            )}
          </div>

          {/* Template Preview Info */}
          {template !== 'custom' && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">템플릿 정보</p>
                  <p>선택한 템플릿에 맞는 기본 양식이 적용됩니다.</p>
                  {content && <p>입력한 내용은 템플릿에 추가됩니다.</p>}
                  <p className="mt-1 font-medium">각 회원의 이름이 자동으로 포함됩니다.</p>
                </div>
              </div>
            </div>
          )}

          {/* Warning Message */}
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">주의사항</p>
                <p>• 이메일 주소가 없는 회원은 자동으로 제외됩니다.</p>
                <p>• 대량 발송 시 시간이 소요될 수 있습니다.</p>
                <p>• 발송 후에는 취소할 수 없습니다.</p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg">
              <div className="flex items-center text-red-800">
                <AlertCircle className="h-5 w-5 mr-2" />
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
              disabled={isSending}
            >
              취소
            </button>
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
              disabled={isSending}
            >
              {isSending ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                  발송 중...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {userCount}명에게 발송
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BulkEmailModal;