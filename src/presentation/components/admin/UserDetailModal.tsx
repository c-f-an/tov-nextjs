"use client";

import { useState, useEffect } from "react";
import { formatDate } from "@/lib/utils/date";
import { EmailModal } from "./EmailModal";
import { SuspendUserModal } from "./SuspendUserModal";

interface UserDetailModalProps {
  userId: number;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  active: { label: "활성", color: "bg-green-100 text-green-800" },
  inactive: { label: "비활성", color: "bg-gray-100 text-gray-800" },
  suspended: { label: "정지", color: "bg-red-100 text-red-800" },
};

const roleLabels: Record<string, { label: string; color: string }> = {
  USER: { label: "일반 사용자", color: "bg-blue-100 text-blue-800" },
  ADMIN: { label: "관리자", color: "bg-purple-100 text-purple-800" },
};

export function UserDetailModal({
  userId,
  isOpen,
  onClose,
  onUpdate,
}: UserDetailModalProps) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);

  // Edit form states
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    churchName: "",
    position: "",
    status: "active",
    role: "USER",
    adminNote: "",
  });

  useEffect(() => {
    if (isOpen && userId) {
      fetchUser();
    }
  }, [isOpen, userId]);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user");

      const data = await response.json();
      setUser(data);
      setFormData({
        username: data.username || "",
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        churchName: data.churchName || "",
        position: data.position || "",
        status: data.status || "active",
        role: data.role || "USER",
        adminNote: data.adminNote || "",
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      alert("사용자 정보를 불러오는 데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update user");

      alert("회원 정보가 업데이트되었습니다.");
      setEditMode(false);
      fetchUser();
      onUpdate();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("업데이트에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (window.confirm(`정말로 회원 상태를 ${statusLabels[newStatus]?.label}(으)로 변경하시겠습니까?`)) {
      try {
        const response = await fetch("/api/admin/users", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            action: "UPDATE_STATUS",
            status: newStatus,
          }),
        });

        if (!response.ok) throw new Error("Failed to update status");

        alert("회원 상태가 변경되었습니다.");
        fetchUser();
        onUpdate();
      } catch (error) {
        console.error("Error updating status:", error);
        alert("상태 변경에 실패했습니다.");
      }
    }
  };

  const handleRoleChange = async (newRole: string) => {
    if (window.confirm(`정말로 회원 권한을 ${roleLabels[newRole]?.label}(으)로 변경하시겠습니까?`)) {
      try {
        const response = await fetch("/api/admin/users", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            action: "UPDATE_ROLE",
            role: newRole,
          }),
        });

        if (!response.ok) throw new Error("Failed to update role");

        alert("회원 권한이 변경되었습니다.");
        fetchUser();
        onUpdate();
      } catch (error) {
        console.error("Error updating role:", error);
        alert("권한 변경에 실패했습니다.");
      }
    }
  };

  const handleSuspendUser = async (reason: string, sendEmail: boolean) => {
    try {
      // Update status to suspended with reason
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "suspended",
          adminNote: `계정 정지 사유: ${reason}\n정지 일시: ${new Date().toLocaleString('ko-KR')}\n\n${formData.adminNote || ''}`,
        }),
      });

      if (!response.ok) throw new Error("Failed to suspend user");

      // Send email notification if requested
      if (sendEmail && user.email) {
        await fetch("/api/admin/users/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            template: "account-suspended",
            subject: "계정 정지 안내",
            content: "",
            title: "계정 정지 안내",
          }),
        });
      }

      alert("회원 계정이 정지되었습니다.");
      fetchUser();
      onUpdate();
    } catch (error) {
      console.error("Error suspending user:", error);
      throw error;
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
          <h2 className="text-xl font-bold">회원 상세 정보</h2>
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
        ) : user ? (
          <div className="p-6">
            {/* 기본 정보 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">기본 정보</h3>
              {editMode ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      아이디
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      이름
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      이메일
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      연락처
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      교회명
                    </label>
                    <input
                      type="text"
                      value={formData.churchName}
                      onChange={(e) => setFormData({ ...formData, churchName: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      직분
                    </label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      아이디
                    </label>
                    <p className="mt-1 text-gray-900">{user.username || "-"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      이름
                    </label>
                    <p className="mt-1 text-gray-900">{user.name || "-"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      이메일
                    </label>
                    <p className="mt-1 text-gray-900">{user.email || "-"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      연락처
                    </label>
                    <p className="mt-1 text-gray-900">{user.phone || "-"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      교회명
                    </label>
                    <p className="mt-1 text-gray-900">{user.churchName || "-"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      직분
                    </label>
                    <p className="mt-1 text-gray-900">{user.position || "-"}</p>
                  </div>
                </div>
              )}
            </div>

            {/* 계정 정보 */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">계정 정보</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    상태
                  </label>
                  <div className="mt-1 flex items-center space-x-2">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                        statusLabels[user.status]?.color
                      }`}
                    >
                      {statusLabels[user.status]?.label}
                    </span>
                    {!editMode && (
                      <select
                        value={user.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="ml-2 text-sm border rounded px-2 py-1"
                      >
                        <option value="active">활성</option>
                        <option value="inactive">비활성</option>
                        <option value="suspended">정지</option>
                      </select>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    권한
                  </label>
                  <div className="mt-1 flex items-center space-x-2">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                        roleLabels[user.role]?.color
                      }`}
                    >
                      {roleLabels[user.role]?.label}
                    </span>
                    {!editMode && (
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(e.target.value)}
                        className="ml-2 text-sm border rounded px-2 py-1"
                      >
                        <option value="USER">일반 사용자</option>
                        <option value="ADMIN">관리자</option>
                      </select>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    가입일
                  </label>
                  <p className="mt-1 text-gray-900">
                    {user.createdAt ? formatDate(user.createdAt) : "-"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    마지막 로그인
                  </label>
                  <p className="mt-1 text-gray-900">
                    {user.lastLoginAt ? formatDate(user.lastLoginAt) : "-"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    로그인 타입
                  </label>
                  <p className="mt-1 text-gray-900">
                    {user.loginType || "일반"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    교단
                  </label>
                  <p className="mt-1 text-gray-900">
                    {user.denomination || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* 관리자 메모 */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">관리자 메모</h3>

              {editMode ? (
                <div className="space-y-4">
                  <div>
                    <textarea
                      value={formData.adminNote}
                      onChange={(e) => setFormData({ ...formData, adminNote: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="회원 관련 메모를 입력하세요..."
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setEditMode(false);
                        setFormData({
                          username: user.username || "",
                          name: user.name || "",
                          email: user.email || "",
                          phone: user.phone || "",
                          churchName: user.churchName || "",
                          position: user.position || "",
                          status: user.status || "active",
                          role: user.role || "USER",
                          adminNote: user.adminNote || "",
                        });
                      }}
                      className="px-4 py-2 border rounded-md hover:bg-gray-50"
                      disabled={isSaving}
                    >
                      취소
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-blue-700 disabled:opacity-50"
                      disabled={isSaving}
                    >
                      {isSaving ? "저장 중..." : "저장"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-md min-h-[100px]">
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {user.adminNote || "메모가 없습니다."}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <div className="space-x-2">
                      <button
                        onClick={() => setIsEmailModalOpen(true)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        메일 발송
                      </button>
                      {user.status !== "suspended" && (
                        <button
                          onClick={() => setIsSuspendModalOpen(true)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          계정 정지
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-blue-700"
                    >
                      정보 수정
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 타임스탬프 */}
            <div className="mt-6 pt-6 border-t text-sm text-gray-500">
              <div className="flex justify-between">
                <span>가입일: {user.createdAt ? formatDate(user.createdAt) : "-"}</span>
                {user.updatedAt && (
                  <span>수정일: {formatDate(user.updatedAt)}</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500">회원 정보를 불러올 수 없습니다.</p>
          </div>
        )}
      </div>

      {/* Email Modal */}
      {user && isEmailModalOpen && (
        <EmailModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          userId={userId}
          userEmail={user.email}
          userName={user.name || user.username}
        />
      )}

      {/* Suspend User Modal */}
      {user && isSuspendModalOpen && (
        <SuspendUserModal
          isOpen={isSuspendModalOpen}
          onClose={() => setIsSuspendModalOpen(false)}
          onConfirm={handleSuspendUser}
          userName={user.name || user.username}
          userEmail={user.email}
        />
      )}
    </div>
  );
}