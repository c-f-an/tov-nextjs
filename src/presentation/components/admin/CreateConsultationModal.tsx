"use client";

import { useState, useRef } from "react";

interface CreateConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

interface UserSearchResult {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
}

const consultationTypes = [
  { value: "dispute-consultation", label: "재정분쟁 상담" },
  { value: "financial-management", label: "재정운영의 실제" },
  { value: "articles-of-incorporation", label: "정관과 규칙" },
  { value: "religious-income", label: "종교인 소득세" },
  { value: "nonprofit-accounting", label: "비영리 회계" },
  { value: "settlement-disclosure", label: "결산 공시" },
  { value: "general", label: "일반 상담" },
  { value: "other", label: "기타" },
];

const positionCodes = [
  { value: 1, label: "위임목사(담임목사)" },
  { value: 2, label: "부목사" },
  { value: 3, label: "전도사(강도사)" },
  { value: 4, label: "사모(목회자가족)" },
  { value: 5, label: "장로" },
  { value: 6, label: "권사" },
  { value: 7, label: "집사" },
  { value: 8, label: "재정담당자" },
  { value: 99, label: "기타" },
];

const inquiryCategories = [
  { value: 1, label: "P-TAX(종교인소득세)" },
  { value: 2, label: "교회재정" },
  { value: 3, label: "정관/규칙" },
  { value: 4, label: "비영리회계" },
  { value: 5, label: "결산공시" },
  { value: 99, label: "기타" },
];

const inquiryChannels = [
  { value: 1, label: "묻고답하기(Q&A 게시판)" },
  { value: 2, label: "전화 상담" },
  { value: 3, label: "이메일" },
  { value: 4, label: "방문" },
  { value: 5, label: "홈페이지 상담 신청폼" },
  { value: 99, label: "기타" },
];

const initialForm = {
  name: "",
  phone: "",
  email: "",
  churchName: "",
  positionCode: "" as "" | number,
  consultationType: "",
  inquiryChannel: "" as "" | number,
  inquiryCategory: "" as "" | number,
  categoryDetail: "",
  preferredDate: "",
  preferredTime: "",
  title: "",
  content: "",
};

export function CreateConsultationModal({
  isOpen,
  onClose,
  onCreated,
}: CreateConsultationModalProps) {
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 회원 연결 상태
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [linkedUser, setLinkedUser] = useState<UserSearchResult | null>(null);
  const [searchDone, setSearchDone] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setFormData(initialForm);
    setSearchQuery("");
    setSearchResults([]);
    setLinkedUser(null);
    setSearchDone(false);
    onClose();
  };

  const handleUserSearch = async () => {
    const q = searchQuery.trim();
    if (!q || q.length < 2) {
      alert("2자 이상 입력해주세요.");
      return;
    }
    setIsSearching(true);
    setSearchDone(false);
    setSearchResults([]);
    try {
      const res = await fetch(`/api/admin/users/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error("검색 실패");
      const data = await res.json();
      setSearchResults(data.users || []);
    } catch {
      alert("회원 검색 중 오류가 발생했습니다.");
    } finally {
      setIsSearching(false);
      setSearchDone(true);
    }
  };

  const handleSelectUser = (user: UserSearchResult) => {
    setLinkedUser(user);
    // 이름·전화·이메일 자동 채움 (기존 입력값이 없을 때만)
    setFormData((prev) => ({
      ...prev,
      name: prev.name || user.name,
      phone: prev.phone || user.phone || "",
      email: prev.email || user.email || "",
    }));
    setSearchResults([]);
    setSearchDone(false);
  };

  const handleUnlinkUser = () => {
    setLinkedUser(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.consultationType || !formData.title || !formData.content) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          positionCode: formData.positionCode || undefined,
          inquiryChannel: formData.inquiryChannel || undefined,
          inquiryCategory: formData.inquiryCategory || undefined,
          preferredDate: formData.preferredDate || undefined,
          preferredTime: formData.preferredTime || undefined,
          email: formData.email || undefined,
          churchName: formData.churchName || undefined,
          categoryDetail: formData.categoryDetail || undefined,
          privacyAgree: true,
          linkedUserId: linkedUser?.id ?? null,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to create consultation");
      }

      handleClose();
      onCreated();
    } catch (error) {
      console.error("Error creating consultation:", error);
      const message = error instanceof Error ? error.message : "상담 등록에 실패했습니다.";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-100/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">상담 등록</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* ── 회원 연결 섹션 ── */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-800 mb-3">회원 연결</h3>

            {/* 연결된 회원 표시 */}
            {linkedUser ? (
              <div className="flex items-center justify-between bg-white border border-blue-300 rounded-md px-4 py-3">
                <div className="text-sm">
                  <span className="inline-flex items-center mr-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">연결됨</span>
                  <span className="font-medium text-gray-900">{linkedUser.name}</span>
                  {linkedUser.phone && <span className="text-gray-500 ml-2">{linkedUser.phone}</span>}
                  {linkedUser.email && <span className="text-gray-400 ml-2">({linkedUser.email})</span>}
                </div>
                <button
                  type="button"
                  onClick={handleUnlinkUser}
                  className="text-xs text-red-500 hover:text-red-700 ml-3"
                >
                  연결 해제
                </button>
              </div>
            ) : (
              <>
                <p className="text-xs text-blue-600 mb-3">
                  전화번호 또는 이메일로 기존 회원을 검색하여 이 상담과 연결하세요.
                  미가입자 상담은 연결 없이 등록 가능합니다.
                </p>
                <div className="flex gap-2">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleUserSearch(); } }}
                    className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="전화번호 또는 이메일 입력"
                  />
                  <button
                    type="button"
                    onClick={handleUserSearch}
                    disabled={isSearching}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:bg-blue-300 whitespace-nowrap"
                  >
                    {isSearching ? "검색 중..." : "회원 검색"}
                  </button>
                </div>

                {/* 검색 결과 */}
                {searchDone && (
                  <div className="mt-3">
                    {searchResults.length === 0 ? (
                      <div className="text-sm text-gray-500 py-2 text-center">
                        일치하는 회원이 없습니다. 비회원으로 등록됩니다.
                      </div>
                    ) : (
                      <ul className="border rounded-md divide-y bg-white max-h-48 overflow-y-auto">
                        {searchResults.map((u) => (
                          <li
                            key={u.id}
                            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                          >
                            <div className="text-sm">
                              <span className="font-medium text-gray-900 mr-2">{u.name}</span>
                              {u.phone && <span className="text-gray-500 mr-2">{u.phone}</span>}
                              {u.email && <span className="text-gray-400 text-xs">{u.email}</span>}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleSelectUser(u)}
                              className="text-xs px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                              선택
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* ── 신청자 정보 ── */}
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-4">신청자 정보</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="신청자 이름"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  연락처 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="010-0000-0000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">교회/단체명</label>
                <input
                  type="text"
                  value={formData.churchName}
                  onChange={(e) => setFormData({ ...formData, churchName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="소속 교회 또는 단체명"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">직분</label>
                <select
                  value={formData.positionCode}
                  onChange={(e) => setFormData({ ...formData, positionCode: e.target.value ? Number(e.target.value) : "" })}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">선택 (선택)</option>
                  {positionCodes.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">문의 경로</label>
                <select
                  value={formData.inquiryChannel}
                  onChange={(e) => setFormData({ ...formData, inquiryChannel: e.target.value ? Number(e.target.value) : "" })}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">선택 (선택)</option>
                  {inquiryChannels.map((ch) => (
                    <option key={ch.value} value={ch.value}>{ch.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ── 상담 내용 ── */}
          <div className="border-t pt-6">
            <h3 className="text-base font-semibold text-gray-800 mb-4">상담 내용</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    상담 분야 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.consultationType}
                    onChange={(e) => setFormData({ ...formData, consultationType: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">선택해주세요</option>
                    {consultationTypes.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">문의 분류</label>
                  <select
                    value={formData.inquiryCategory}
                    onChange={(e) => setFormData({
                      ...formData,
                      inquiryCategory: e.target.value ? Number(e.target.value) : "",
                      categoryDetail: e.target.value !== "99" ? "" : formData.categoryDetail,
                    })}
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">선택 (선택)</option>
                    {inquiryCategories.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                  {formData.inquiryCategory === 99 && (
                    <input
                      type="text"
                      value={formData.categoryDetail}
                      onChange={(e) => setFormData({ ...formData, categoryDetail: e.target.value })}
                      className="w-full mt-2 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="기타 분류 내용"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">희망 상담일</label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">희망 시간대</label>
                  <select
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">선택 (선택)</option>
                    <option value="morning">오전 (09:00-12:00)</option>
                    <option value="afternoon">오후 (13:00-18:00)</option>
                    <option value="evening">저녁 (18:00-20:00)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  상담 제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="상담 제목을 입력해주세요"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  상담 내용 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="상담 내용을 입력해주세요"
                  required
                />
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="border-t pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isSubmitting ? "등록 중..." : "상담 등록"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
